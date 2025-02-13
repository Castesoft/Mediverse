using MainService.Core.Helpers.Pagination;
using MainService.Core.Interfaces.Services;
using MainService.Core.Extensions;
using MainService.Extensions;
using MainService.Models.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using AutoMapper;
using MainService.Core.DTOs.Clinics;
using MainService.Core.Helpers.Params;
using MainService.Core.DTOs.Addresses;
using MainService.Models.Entities.Aggregate;
using MainService.Models.Helpers.Enums;
using Serilog;
using CloudinaryDotNet.Actions;
using CloudinaryDotNet;

namespace MainService.Controllers;

[Authorize]
public class ClinicsController(
    IUnitOfWork uow,
    IAddressesService service,
    UserManager<AppUser> userManager,
    IMapper mapper,
    IGoogleService googleService,
    ICloudinaryService cloudinaryService
    ) : BaseApiController
{
    private const string Subject = "clínica";
    private const string SubjectArticle = "La";

    [HttpGet]
    public async Task<ActionResult<PagedList<ClinicDto>>> GetPagedListAsync([FromQuery] ClinicParams param)
    {
        if (!param.DoctorId.HasValue && param.FromSection == SiteSection.Admin)
        {
            return BadRequest("When requesting from admin section, DoctorId is required.");
        }

        if (param.FromSection != SiteSection.Admin)
        {
            param.DoctorId = User.GetUserId();
        }

        var pagedList = await uow.ClinicRepository.GetPagedListAsync(param);

        Response.AddPaginationHeader(new PaginationHeader(pagedList.CurrentPage, pagedList.PageSize,
            pagedList.TotalCount, pagedList.TotalPages));

        return pagedList;
    }

    [HttpGet("options")]
    public async Task<ActionResult<List<OptionDto>>> GetOptionDtosAsync([FromQuery] ClinicParams param)
    {
        param.DoctorId = User.GetUserId();

        return await uow.ClinicRepository.GetOptionsAsync(param);
    }

    [AllowAnonymous]
    [HttpGet("all")]
    public async Task<ActionResult<List<ClinicDto>>> GetAllAsync([FromQuery] ClinicParams param)
    {
        var data = await uow.ClinicRepository.GetAllDtoAsync(param);

        return data;
    }

    [HttpGet("{id:int}")]
    public async Task<ActionResult<ClinicDto?>> GetByIdAsync([FromRoute] int id)
    {
        ClinicDto? item = await uow.ClinicRepository.GetDtoByIdAsync(id);

        if (item == null) return NotFound($"{SubjectArticle} {Subject} de ID {id} no fue encontrado.");

        return item;
    }

    // [Authorize(Policy = "RequireAdminRole")]
    [HttpDelete("{id:int}")]
    public async Task<ActionResult> DeleteByIdAsync(int id)
    {
        var item = await uow.AddressRepository.GetByIdAsNoTrackingAsync(id);

        if (item == null) return NotFound($"{SubjectArticle} {Subject} de ID {id} no fue encontrado.");

        var deleteResult = await service.DeleteAsync(item);

        if (!deleteResult) return BadRequest($"Error al eliminar {Subject} de {item.Name}.");

        return Ok();
    }

    [HttpDelete("range/{ids}")]
    public async Task<ActionResult> DeleteRangeAsync([FromRoute] string ids)
    {
        var selectedIds = ids.Split(',').Select(int.Parse).ToList();

        foreach (var item in selectedIds)
        {
            var itemToDelete = await uow.AddressRepository.GetByIdAsNoTrackingAsync(item);

            if (itemToDelete == null) return NotFound($"{SubjectArticle} {Subject} de ID {item} no fue encontrado.");

            var deleteResult = await service.DeleteAsync(itemToDelete);

            if (!deleteResult) return BadRequest($"Error al eliminar {Subject} de {itemToDelete.Name}.");
        }

        return Ok();
    }

    [HttpPost]
    public async Task<ActionResult<ClinicDto?>> AddAsync([FromForm] ClinicCreateDto request)
    {
        if (string.IsNullOrEmpty(request.Name)) return BadRequest("El nombre es requerido.");
        if (string.IsNullOrEmpty(request.Street)) return BadRequest("La calle es requerida.");
        if (string.IsNullOrEmpty(request.ExteriorNumber)) return BadRequest("El número exterior es requerido.");
        if (string.IsNullOrEmpty(request.Neighborhood)) return BadRequest("La colonia es requerida.");
        if (string.IsNullOrEmpty(request.City)) return BadRequest("La ciudad es requerida.");
        if (string.IsNullOrEmpty(request.State)) return BadRequest("El estado es requerido.");
        if (string.IsNullOrEmpty(request.Country)) return BadRequest("El país es requerido.");
        if (string.IsNullOrEmpty(request.Zipcode)) return BadRequest("El código postal es requerido.");
        if (!request.IsMain.HasValue) return BadRequest("El rol de la dirección es requerido.");
        
        AppUser? doctor = await userManager.Users
            .Include(x => x.DoctorClinics)
            .ThenInclude(x => x.Clinic)
            .SingleOrDefaultAsync(x => x.Id == User.GetUserId());

        if (doctor == null) return BadRequest("Error al obtener el doctor.");

        if (request.IsMain.Value)
            foreach (var item in doctor.DoctorClinics)
                item.IsMain = false;

        Address clinic = mapper.Map<ClinicCreateDto, Address>(request);

        var (latitude, longitude) =
            await googleService.GetAddressCoordinatesAsync(googleService.GetAddressText(clinic));

        clinic.Longitude = longitude;
        clinic.Latitude = latitude;

        // Existing image upload logic.
        if (request.Files.Count() > 0 && request.MainImageIndex.HasValue)
        {
            foreach (IFormFile file in request.Files)
            {
                var fileName = Guid.NewGuid().ToString();
                var uploadParams = new ImageUploadParams
                {
                    Folder = "Mediverse/Clinics",
                    File = new FileDescription(fileName, file.OpenReadStream())
                };

                ImageUploadResult uploadResult = await cloudinaryService.UploadAsync(file, uploadParams);

                if (uploadResult.Error != null) return BadRequest(uploadResult.Error.Message);
                
                clinic.ClinicPhotos.Add(new ClinicPhoto(new Photo
                {
                    Url = uploadResult.SecureUrl,
                    PublicId = uploadResult.PublicId,
                    Size = (int?)file.Length
                }));
            }

            if (clinic.ClinicPhotos.Count() != 0)
            {
                int mainImageIndex = request.MainImageIndex.Value;

                if (mainImageIndex >= 0 && mainImageIndex < clinic.ClinicPhotos.Count())
                {
                    foreach (var (photo, index) in clinic.ClinicPhotos.Select((p, i) => (p, i)))
                    {
                        photo.IsMain = index == mainImageIndex;
                    }
                }
                else
                {
                    clinic.ClinicPhotos.First().IsMain = true;
                }

                ClinicPhoto? mainPhoto = clinic.ClinicPhotos.FirstOrDefault(p => p.IsMain);

                Log.Information(mainPhoto != null
                        ? "Main photo confirmed at index {Index}"
                        : "WARNING: No main photo set!",
                    clinic.ClinicPhotos.ToList().IndexOf(mainPhoto!));
            }
        }
        doctor.DoctorClinics.Add(new DoctorClinic(clinic, request.IsMain.Value));

        IdentityResult updateResult = await userManager.UpdateAsync(doctor);

        if (!updateResult.Succeeded) return BadRequest($"Error al agregar la clínica de {doctor.FirstName}.");

        ClinicDto? itemToReturn = await uow.ClinicRepository.GetDtoByIdAsync(clinic.Id);

        return itemToReturn;
    }

    [HttpPut("{id:int}")]
    public async Task<ActionResult<ClinicDto?>> UpdateAsync([FromForm] ClinicUpdateDto request, [FromRoute] int id)
    {
        if (string.IsNullOrEmpty(request.Name)) return BadRequest("El nombre es requerido.");
        if (string.IsNullOrEmpty(request.Street)) return BadRequest("La calle es requerida.");
        if (string.IsNullOrEmpty(request.ExteriorNumber)) return BadRequest("El número exterior es requerido.");
        if (string.IsNullOrEmpty(request.Neighborhood)) return BadRequest("La colonia es requerida.");
        if (string.IsNullOrEmpty(request.City)) return BadRequest("La ciudad es requerida.");
        if (string.IsNullOrEmpty(request.State)) return BadRequest("El estado es requerido.");
        if (string.IsNullOrEmpty(request.Country)) return BadRequest("El país es requerido.");
        if (string.IsNullOrEmpty(request.Zipcode)) return BadRequest("El código postal es requerido.");
        if (!request.IsMain.HasValue) return BadRequest("El rol de la dirección es requerido.");

        if (!await uow.AddressRepository.ExistsByIdAsync(id)) return NotFound("La dirección no fue encontrada.");
        
        AppUser? doctor = await userManager.Users
            .Include(x => x.DoctorClinics)
            .ThenInclude(x => x.Clinic)
            .SingleOrDefaultAsync(x => x.Id == User.GetUserId());

        if (doctor == null) return BadRequest("Error al obtener el doctor.");

        if (!await uow.ClinicRepository.ExistsByIdAndDoctorIdAsync(id, doctor.Id)) return BadRequest("La clínica no pertenece al doctor.");

        if (request.IsMain.Value)
            foreach (var item in doctor.DoctorClinics)
                item.IsMain = false;

        Address? clinic = await uow.AddressRepository.GetByIdAsync(id);

        if (clinic == null) return BadRequest("Error al obtener la clínica.");

        if (
            request.Street != clinic.Street ||
            request.ExteriorNumber != clinic.ExteriorNumber ||
            request.Neighborhood != clinic.Neighborhood ||
            request.City != clinic.City ||
            request.State != clinic.State ||
            request.Country != clinic.Country ||
            request.Zipcode != clinic.Zipcode
        ) {
            var (latitude, longitude) =
                await googleService.GetAddressCoordinatesAsync(googleService.GetAddressText(clinic));

            clinic.Longitude = longitude;
            clinic.Latitude = latitude;

            Log.Information("Coordinates updated for {clinicName}.", clinic.Name);
        }

        mapper.Map(request, clinic);

        clinic.DoctorClinic.IsMain = request.IsMain.Value;

        if (uow.HasChanges()) {
            if (!await uow.Complete()) return BadRequest($"Error al actualizar la clínica de {doctor.FirstName}.");
        }

        ClinicDto? itemToReturn = await uow.ClinicRepository.GetDtoByIdAsync(clinic.Id);

        return itemToReturn;
    }

    [AllowAnonymous]
    [HttpGet("zipcodes/{zipcode}")]
    public async Task<ActionResult<List<ZipcodeAddressOption>>> GetZipcodeAddressOptionsAsync(
        [FromRoute] string zipcode) =>
        await service.GetZipcodeAddressOptionsAsync(zipcode);

    private async Task<ImageUploadResult?> UploadImage(IFormFile file)
    {
        var fileName = Guid.NewGuid().ToString();
        var uploadParams = new ImageUploadParams
        {
            Folder = "Mediverse/Clinics",
            File = new FileDescription(fileName, file.OpenReadStream())
        };

        var uploadResult = await cloudinaryService.UploadAsync(file, uploadParams);
        return uploadResult.StatusCode == System.Net.HttpStatusCode.OK ? uploadResult : null;
    }
}
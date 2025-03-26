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
using MainService.Authorization.Operations;

namespace MainService.Controllers;

[Authorize]
public class ClinicsController(
    IUnitOfWork uow,
    IAddressesService service,
    UserManager<AppUser> userManager,
    IMapper mapper,
    IGoogleService googleService,
    ICloudinaryService cloudinaryService,
    IAuthorizationService authService
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

        Response.AddPaginationHeader(new PaginationHeader(
            pagedList.CurrentPage,
            pagedList.PageSize,
            pagedList.TotalCount,
            pagedList.TotalPages
        ));

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
        var item = await uow.ClinicRepository.GetDtoByIdAsync(id);

        if (item == null) return NotFound($"{SubjectArticle} {Subject} de ID {id} no fue encontrado.");

        var clinic = await uow.AddressRepository.GetByIdAsNoTrackingAsync(id);
        if (clinic == null)
            return NotFound($"Clinic with ID {id} not found.");

        var authorizationResult = await authService.AuthorizeAsync(User, clinic, ClinicOperations.Read);
        if (!authorizationResult.Succeeded) return Forbid();

        return item;
    }

    [HttpDelete("{id:int}")]
    public async Task<ActionResult> DeleteByIdAsync(int id)
    {
        var item = await uow.AddressRepository.GetByIdAsNoTrackingAsync(id);

        if (item == null) return NotFound($"{SubjectArticle} {Subject} de ID {id} no fue encontrado.");

        var authorizationResult = await authService.AuthorizeAsync(User, item, ClinicOperations.Delete);
        if (!authorizationResult.Succeeded) return Forbid();

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

            var authorizationResult = await authService.AuthorizeAsync(User, itemToDelete, ClinicOperations.Delete);
            if (!authorizationResult.Succeeded) return Forbid();

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

        var doctor = await userManager.Users
            .Include(x => x.DoctorClinics)
            .ThenInclude(x => x.Clinic)
            .SingleOrDefaultAsync(x => x.Id == User.GetUserId());

        if (doctor == null) return BadRequest("Error al obtener el doctor.");

        if (request.IsMain.Value)
            foreach (var item in doctor.DoctorClinics)
                item.IsMain = false;

        var clinic = mapper.Map<ClinicCreateDto, Address>(request);

        var (latitude, longitude) =
            await googleService.GetAddressCoordinatesAsync(googleService.GetAddressText(clinic));

        clinic.Longitude = longitude;
        clinic.Latitude = latitude;

        var authorizationResult = await authService.AuthorizeAsync(User, clinic, ClinicOperations.Create);
        if (!authorizationResult.Succeeded) return Forbid();

        // Existing image upload logic.
        if (request.Files.Count != 0 && request.MainImageIndex.HasValue)
        {
            foreach (var file in request.Files)
            {
                var fileName = Guid.NewGuid().ToString();
                var uploadParams = new ImageUploadParams
                {
                    Folder = "Mediverse/Clinics",
                    File = new FileDescription(fileName, file.OpenReadStream())
                };

                var uploadResult = await cloudinaryService.UploadAsync(file, uploadParams);

                if (uploadResult.Error != null) return BadRequest(uploadResult.Error.Message);

                clinic.ClinicPhotos.Add(new ClinicPhoto(new Photo
                {
                    Url = uploadResult.SecureUrl,
                    PublicId = uploadResult.PublicId,
                    Size = (int?)file.Length
                }));
            }

            if (clinic.ClinicPhotos.Count != 0)
            {
                var mainImageIndex = request.MainImageIndex.Value;
                if (mainImageIndex >= 0 && mainImageIndex < clinic.ClinicPhotos.Count)
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

                var mainPhoto = clinic.ClinicPhotos.FirstOrDefault(p => p.IsMain);

                Log.Information(mainPhoto != null
                        ? "Main photo confirmed at index {Index}"
                        : "WARNING: No main photo set!",
                    clinic.ClinicPhotos.ToList().IndexOf(mainPhoto!));

                if (mainPhoto != null)
                {
                    clinic.ClinicLogo = new ClinicLogo(mainPhoto.Photo);
                }
            }
        }

        doctor.DoctorClinics.Add(new DoctorClinic(clinic, request.IsMain.Value));

        var updateResult = await userManager.UpdateAsync(doctor);
        if (!updateResult.Succeeded) return BadRequest($"Error al agregar la clínica de {doctor.FirstName}.");

        return await uow.ClinicRepository.GetDtoByIdAsync(clinic.Id);
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

        var doctor = await userManager.Users
            .Include(x => x.DoctorClinics)
            .ThenInclude(x => x.Clinic)
            .SingleOrDefaultAsync(x => x.Id == User.GetUserId());

        if (doctor == null) return BadRequest("Error al obtener el doctor.");

        if (!await uow.ClinicRepository.ExistsByIdAndDoctorIdAsync(id, doctor.Id))
            return BadRequest("La clínica no pertenece al doctor.");

        if (request.IsMain.Value)
            foreach (var item in doctor.DoctorClinics)
                item.IsMain = false;

        var itemToUpdate = await uow.AddressRepository.GetByIdAsync(id);

        if (itemToUpdate == null) return BadRequest("Error al obtener la clínica.");

        var authorizationResult = await authService.AuthorizeAsync(User, itemToUpdate, ClinicOperations.Update);
        if (!authorizationResult.Succeeded) return Forbid();

        if (
            request.Street != itemToUpdate.Street ||
            request.ExteriorNumber != itemToUpdate.ExteriorNumber ||
            request.Neighborhood != itemToUpdate.Neighborhood ||
            request.City != itemToUpdate.City ||
            request.State != itemToUpdate.State ||
            request.Country != itemToUpdate.Country ||
            request.Zipcode != itemToUpdate.Zipcode
        )
        {
            var (latitude, longitude) =
                await googleService.GetAddressCoordinatesAsync(googleService.GetAddressText(itemToUpdate));

            itemToUpdate.Longitude = longitude;
            itemToUpdate.Latitude = latitude;

            Log.Information("Coordinates updated for {clinicName}.", itemToUpdate.Name);
        }

        itemToUpdate.Name = request.Name;
        itemToUpdate.Description = request.Description;
        itemToUpdate.Street = request.Street;
        itemToUpdate.InteriorNumber = request.InteriorNumber;
        itemToUpdate.ExteriorNumber = request.ExteriorNumber;
        itemToUpdate.Neighborhood = request.Neighborhood;
        itemToUpdate.City = request.City;
        itemToUpdate.State = request.State;
        itemToUpdate.Country = request.Country;
        itemToUpdate.Zipcode = request.Zipcode;
        itemToUpdate.DoctorClinic.IsMain = request.IsMain;

        if (request.RemovedImageIds != null && request.RemovedImageIds.Any())
        {
            var photosToRemove = itemToUpdate.ClinicPhotos
                .Where(pp => request.RemovedImageIds.Contains(pp.PhotoId.ToString()))
                .ToList();

            foreach (var photo in photosToRemove)
            {
                if (!string.IsNullOrEmpty(photo.Photo.PublicId))
                {
                    await cloudinaryService.DeleteAsync(photo.Photo.PublicId);
                }

                itemToUpdate.ClinicPhotos.Remove(photo);
                uow.PhotoRepository.Delete(photo.Photo);
            }
        }

        if (request.Files != null && request.Files.Count > 0)
        {
            foreach (var file in request.Files)
            {
                var uploadResult = await UploadImage(file);
                if (uploadResult != null)
                {
                    itemToUpdate.ClinicPhotos.Add(new ClinicPhoto(new Photo
                    {
                        Url = uploadResult.SecureUrl,
                        PublicId = uploadResult.PublicId,
                        Size = (int?)file.Length
                    }));
                }
            }
        }

        if (itemToUpdate.ClinicPhotos.Count != 0)
        {
            var mainPhotoIndex = request.MainImageIndex;
            if (mainPhotoIndex >= 0 && mainPhotoIndex < itemToUpdate.ClinicPhotos.Count)
            {
                foreach (var (photo, index) in itemToUpdate.ClinicPhotos.Select((p, i) => (p, i)))
                {
                    photo.IsMain = index == mainPhotoIndex;

                    if (photo.IsMain)
                    {
                        itemToUpdate.ClinicLogo = new ClinicLogo(photo.Photo);
                    }
                }
            }
        }

        if (uow.HasChanges())
        {
            if (!await uow.Complete()) return BadRequest($"Error al actualizar la clínica de {doctor.FirstName}.");
        }

        var itemToReturn = await uow.ClinicRepository.GetDtoByIdAsync(id);
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
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

namespace MainService.Controllers;

[Authorize]
public class ClinicsController(
    IUnitOfWork uow,
    IAddressesService service,
    UserManager<AppUser> userManager,
    IMapper mapper,
    IGoogleService googleService) : BaseApiController
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
        var item = await uow.ClinicRepository.GetDtoByIdAsync(id);

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
    public async Task<ActionResult<ClinicDto?>> CreateClinicAsync([FromBody] ClinicCreateDto request)
    {
        var doctor = await userManager.Users
            .Include(x => x.DoctorClinics)
            .ThenInclude(x => x.Clinic)
            .SingleOrDefaultAsync(x => x.Id == User.GetUserId());

        if (doctor == null) return BadRequest("Error al obtener el doctor.");

        if (request.IsMain)
            foreach (var item in doctor.DoctorClinics)
                item.IsMain = false;

        var (latitude, longitude) =
            await googleService.GetAddressCoordinatesAsync(googleService.GetAddressText(mapper.Map<Address>(request)));

        var clinic = mapper.Map<Address>(request);

        clinic.Longitude = longitude;
        clinic.Latitude = latitude;

        doctor.DoctorClinics.Add(new DoctorClinic(clinic, request.IsMain));

        var updateResult = await userManager.UpdateAsync(doctor);

        if (!updateResult.Succeeded) return BadRequest($"Error al agregar la clínica de {doctor.FirstName}.");

        return await uow.ClinicRepository.GetDtoByIdAsync(clinic.Id);
    }

    [HttpPut]
    public async Task<ActionResult<ClinicDto?>> UpdateClinicAsync([FromBody] ClinicUpdateDto request)
    {
        var doctor = await userManager.Users
            .Include(x => x.DoctorClinics)
            .ThenInclude(x => x.Clinic)
            .SingleOrDefaultAsync(x => x.Id == User.GetUserId());

        if (doctor == null) return BadRequest("Error al obtener el doctor.");

        if (request.IsMain)
            foreach (var item in doctor.DoctorClinics)
                item.IsMain = false;

        var (latitude, longitude) =
            await googleService.GetAddressCoordinatesAsync(googleService.GetAddressText(mapper.Map<Address>(request)));

        var clinic = mapper.Map<Address>(request);

        request.Longitude = longitude;
        request.Latitude = latitude;

        doctor.DoctorClinics.Add(new DoctorClinic(clinic, request.IsMain));

        var updateResult = await userManager.UpdateAsync(doctor);

        if (!updateResult.Succeeded) return BadRequest($"Error al agregar la clínica de {doctor.FirstName}.");

        return await uow.ClinicRepository.GetDtoByIdAsync(clinic.Id);
    }

    [AllowAnonymous]
    [HttpGet("zipcodes/{zipcode}")]
    public async Task<ActionResult<List<ZipcodeAddressOption>>> GetZipcodeAddressOptionsAsync(
        [FromRoute] string zipcode) =>
        await service.GetZipcodeAddressOptionsAsync(zipcode);
}
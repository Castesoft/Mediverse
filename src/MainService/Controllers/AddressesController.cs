using MainService.Core.DTOs;
using MainService.Core.DTOs.Addresses;
using MainService.Core.Helpers.Pagination;
using MainService.Core.Helpers.Params;
using MainService.Core.Interfaces.Services;
using MainService.Core.Extensions;
using MainService.Extensions;
using MainService.Models.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using AutoMapper;

namespace MainService.Controllers;

[Authorize]
public class AddressesController(IUnitOfWork uow, IAddressesService service, UserManager<AppUser> userManager, IMapper mapper, IGoogleService googleService) : BaseApiController
{
    private static readonly string subject = "dirección";
    private static readonly string subjectArticle = "La";

    public async Task<ActionResult<PagedList<AddressDto>>> GetPagedListAsync([FromQuery] AddressParams param)
    {
        var pagedList = await uow.AddressRepository.GetPagedListAsync(param, User);

        Response.AddPaginationHeader(new PaginationHeader(pagedList.CurrentPage, pagedList.PageSize,
            pagedList.TotalCount, pagedList.TotalPages));

        return pagedList;
    }

    [AllowAnonymous]
    [HttpGet("all")]
    public async Task<ActionResult<List<AddressDto>>> GetAllAsync([FromQuery] AddressParams param)
    {
        var data = await uow.AddressRepository.GetAllDtoAsync(param);
        
        return data;
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<AddressDto>> GetByIdAsync([FromRoute]int id)
    {
        var item = await uow.AddressRepository.GetDtoByIdAsync(id);

        if (item == null) return NotFound($"{subjectArticle} {subject} de ID {id} no fue encontrado.");

        return item;
    }

    // [Authorize(Policy = "RequireAdminRole")]
    [HttpDelete("{id}")]
    public async Task<ActionResult> DeleteByIdAsync(int id)
    {
        var item = await uow.AddressRepository.GetByIdAsNoTrackingAsync(id);

        if (item == null) return NotFound($"{subjectArticle} {subject} de ID {id} no fue encontrado.");

        var deleteResult = await service.DeleteAsync(item);

        if (!deleteResult) return BadRequest($"Error al eliminar {subject} de {item.Name}.");

        return Ok();
    }

    [HttpDelete("range/{ids}")]
    public async Task<ActionResult> DeleteRangeAsync([FromRoute]string ids)
    {   
        var selectedIds = ids.Split(',').Select(int.Parse).ToList();

        foreach (var item in selectedIds)
        {
            var itemToDelete = await uow.AddressRepository.GetByIdAsNoTrackingAsync(item);

            if (itemToDelete == null) return NotFound($"{subjectArticle} {subject} de ID {item} no fue encontrado.");

            var deleteResult = await service.DeleteAsync(itemToDelete);

            if (!deleteResult) return BadRequest($"Error al eliminar {subject} de {itemToDelete.Name}.");
        }
        
        return Ok();
    }

    [HttpPost("clinic")]
    public async Task<ActionResult<AddressDto>> CreateClinicAsync([FromBody] ClinicCreateDto request)
    {
        AppUser doctor = await userManager.Users
            .Include(x => x.DoctorClinics)
                .ThenInclude(x => x.Clinic)
            .SingleOrDefaultAsync(x => x.Id == User.GetUserId());
        
        if (request.IsMain)
            foreach (var item in doctor.DoctorClinics)
                item.IsMain = false;
        
        var (latitude, longitude) = await googleService.GetAddressCoordinatesAsync(googleService.GetAddressText(mapper.Map<Address>(request)));

        Address clinic = mapper.Map<Address>(request);

        clinic.Longitude = longitude; clinic.Latitude = latitude;

        doctor.DoctorClinics.Add(new(clinic, request.IsMain));

        IdentityResult updateResult = await userManager.UpdateAsync(doctor);

        if (!updateResult.Succeeded) return BadRequest($"Error al agregar la clínica de {doctor.FirstName}.");

        var itemToReturn = await uow.AddressRepository.GetDtoByIdAsync(clinic.Id);

        return itemToReturn;
    }

    [HttpPut("clinic")]
    public async Task<ActionResult<AddressDto>> UpdateClinicAsync([FromBody] ClinicUpdateDto request)
    {
        AppUser doctor = await userManager.Users
            .Include(x => x.DoctorClinics)
                .ThenInclude(x => x.Clinic)
            .SingleOrDefaultAsync(x => x.Id == User.GetUserId());
        
        if (request.IsMain)
            foreach (var item in doctor.DoctorClinics)
                item.IsMain = false;
        
        var (latitude, longitude) = await googleService.GetAddressCoordinatesAsync(googleService.GetAddressText(mapper.Map<Address>(request)));

        Address clinic = mapper.Map<Address>(request);

        request.Longitude = longitude; request.Latitude = latitude;

        doctor.DoctorClinics.Add(new(clinic, request.IsMain));

        IdentityResult updateResult = await userManager.UpdateAsync(doctor);

        if (!updateResult.Succeeded) return BadRequest($"Error al agregar la clínica de {doctor.FirstName}.");

        var itemToReturn = await uow.AddressRepository.GetDtoByIdAsync(clinic.Id);

        return itemToReturn;
    }

    [AllowAnonymous]
    [HttpGet("zipcodes/{zipcode}")]
    public async Task<ActionResult<List<ZipcodeAddressOption>>> GetZipcodeAddressOptionsAsync([FromRoute]string zipcode) =>
        await service.GetZipcodeAddressOptionsAsync(zipcode);
}

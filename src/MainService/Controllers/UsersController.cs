using MainService.Core.DTOs;
using MainService.Core.DTOs.User;
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
public class UsersController(IUnitOfWork uow, IUsersService service, UserManager<AppUser> userManager, IMapper mapper) : BaseApiController
{
    private static readonly string subject = "usuario";
    private static readonly string subjectArticle = "El";

        
    public async Task<ActionResult<PagedList<UserDto>>> GetPagedListAsync([FromQuery] UserParams param)
    {
        var pagedList = await uow.UserRepository.GetPagedListAsync(param, User);

        foreach (var item in pagedList)
        {
            item.DoctorEvents = item.DoctorEvents.Where(e => e.Doctor.Id == User.GetUserId()).ToList();
            item.DoctorPayments = item.DoctorPayments.Where(p => p.DoctorId == User.GetUserId()).ToList();
        }

        Response.AddPaginationHeader(new PaginationHeader(pagedList.CurrentPage, pagedList.PageSize,
            pagedList.TotalCount, pagedList.TotalPages));

        return pagedList;
    }

    [AllowAnonymous]
    [HttpGet("all")]
    public async Task<ActionResult<List<UserDto>>> GetAllAsync([FromQuery] UserParams param)
    {
        var data = await uow.UserRepository.GetAllDtoAsync(param);
        
        return data;
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<UserDto>> GetByIdAsync([FromRoute]int id)
    {
        var item = await uow.UserRepository.GetDtoByIdAsync(id);
        var patient = await uow.UserRepository.GetPatientDtoByIdAsync(id);

        item.HasPatientInformationAccess = item.SharedDoctors.Any(x => x.DoctorId == User.GetUserId() && x.HasPatientInformationAccess);
        item.SharedDoctors = [];

        if (!item.HasPatientInformationAccess)
        {
            item.MedicalInsuranceCompanies = [];
        }

        var doctorEvents = item.DoctorEvents.ToList();
        item.DoctorEvents = doctorEvents.Where(e => e.Doctor.Id == User.GetUserId()).ToList();
        item.DoctorPayments = item.DoctorPayments.Where(p => p.DoctorId == User.GetUserId()).ToList();
        foreach (var _event in item.DoctorEvents)
        {
            _event.Patient = patient;
        }

        if (item == null) return NotFound($"{subjectArticle} {subject} de ID {id} no fue encontrado.");

        return item;
    }
    
    [HttpGet("summary")]
    public async Task<ActionResult<List<UserSummaryDto>>> GetSummaryAsync([FromQuery] UserParams param)
    {
        var item = await uow.UserRepository.GetSummaryDtosAsync(param, User);

        if (item == null) return NotFound($"{subjectArticle} {subject} no fue encontrado.");

        return item;
    }

    // [Authorize(Policy = "RequireAdminRole")]
    [HttpDelete("{id}")]
    public async Task<ActionResult> DeleteByIdAsync(int id)
    {
        var item = await uow.UserRepository.GetByIdAsNoTrackingAsync(id);

        if (item == null) return NotFound($"{subjectArticle} {subject} de ID {id} no fue encontrado.");

        var deleteResult = await service.DeleteAsync(item);

        if (!deleteResult) return BadRequest($"Error al eliminar {subject} de {item.FirstName}.");

        return Ok();
    }

    [HttpDelete("range/{ids}")]
    public async Task<ActionResult> DeleteRangeAsync([FromRoute]string ids)
    {   
        var selectedIds = ids.Split(',').Select(int.Parse).ToList();

        foreach (var item in selectedIds)
        {
            var itemToDelete = await uow.UserRepository.GetByIdAsNoTrackingAsync(item);

            if (itemToDelete == null) return NotFound($"{subjectArticle} {subject} de ID {item} no fue encontrado.");

            var deleteResult = await service.DeleteAsync(itemToDelete);

            if (!deleteResult) return BadRequest($"Error al eliminar {subject} de {itemToDelete.Email}.");
        }
        
        return Ok();
    }

    // [Authorize(Policy = "RequireAdminRole")]
    [HttpPut("edit-roles/{email}")]
    public async Task<ActionResult<UserDto>> EditRolesAsync
        ([FromRoute]string email, [FromQuery] string roles)
    {
        string[] requestedRoles = [.. roles.Split(',')];
        
        var item = await userManager.Users
            .Include(x => x.UserRoles).ThenInclude(x => x.Role)
            .SingleOrDefaultAsync(x => x.Email == email);

        if (item == null) return NotFound($"El {subject} de correo {email} no fue encontrado.");

        List<string> userCurrentRoleNames = item.UserRoles.Select(ur => ur.Role.Name).ToList();

        List<string> rolesToAdd = requestedRoles.Except(userCurrentRoleNames).ToList();
        List<string> rolesToRemove = userCurrentRoleNames.Except(requestedRoles).ToList();

        foreach (var roleName in rolesToAdd)
        {
            var result = await userManager.AddToRoleAsync(item, roleName);
            if (!result.Succeeded) return BadRequest($"Error agregando {subject} al rol {roleName}.");
        }

        foreach (var roleName in rolesToRemove)
        {
            var result = await userManager.RemoveFromRoleAsync(item, roleName);
            if (!result.Succeeded) return BadRequest($"Error eliminando {subject} del rol {roleName}.");
        }

        var itemToReturn = await uow.UserRepository.GetDtoByIdAsync(item.Id);

        return itemToReturn;
    }

    [HttpPost("patient")]
    public async Task<ActionResult<UserDto>> CreateAsync([FromBody] PatientCreateDto request)
    {
        if (await service.EmailExistsAsync(request.Email))
        {
            var patient = await userManager.Users
                .Include(x => x.Doctors)
                .SingleOrDefaultAsync(x => x.Email == request.Email);

            if (patient.Email == User.GetEmail())
                return BadRequest($"No puedes agregar tu propio email como paciente.");

            if (patient.Doctors.Any(x => x.DoctorId == User.GetUserId()))
                return BadRequest($"El paciente con email {request.Email} ya está registrado.");

            patient.Doctors.Add(new(User.GetUserId()));

            var updateResult = await userManager.UpdateAsync(patient);

            if (!updateResult.Succeeded) return BadRequest($"Error al agregar paciente con email {request.Email}.");
        }
        else
        {
            var patient = mapper.Map<AppUser>(request);

            var createResult = await userManager.CreateAsync(patient, "Pa$$w0rd");

            if (!createResult.Succeeded) return BadRequest($"Error al crear paciente con email {request.Email}.");

            var roleResult = await userManager.AddToRoleAsync(patient, "Patient");

            if (!roleResult.Succeeded) return BadRequest($"Error al agregar paciente con email {request.Email}.");

            patient.Doctors.Add(new(User.GetUserId()));

            var updateResult = await userManager.UpdateAsync(patient);

            if (!updateResult.Succeeded) return BadRequest($"Error al agregar paciente a la lista de pacientes del doctor.");

        }
        var patientToReturn = await uow.UserRepository.GetDtoByEmailAsync(request.Email);

        return Ok(patientToReturn);
    }
}

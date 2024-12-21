using AutoMapper;
using MainService.Core.DTOs.Patients;
using MainService.Core.DTOs.User;
using MainService.Core.Extensions;
using MainService.Core.Helpers.Pagination;
using MainService.Core.Helpers.Params;
using MainService.Core.Interfaces.Services;
using MainService.Extensions;
using MainService.Models.Entities;
using MainService.Models.Entities.Aggregate;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace MainService.Controllers;
[Authorize]
public class PatientsController(
    IUnitOfWork uow, 
    UserManager<AppUser> userManager,
    IMapper mapper,
    IUsersService service
) : BaseApiController
{
    [HttpGet]
    public async Task<ActionResult<PagedList<PatientDto>>> GetPagedListAsync([FromQuery] PatientParams param)
    {
        param.DoctorId = User.GetUserId();
        param.UserId = User.GetUserId();
        
        PagedList<PatientDto> pagedList = await uow.PatientRepository.GetPagedListAsync(param);

        foreach (var item in pagedList)
        {
            item.DoctorEvents = item.DoctorEvents.Where(e => e.Doctor != null && e.Doctor.Id == User.GetUserId()).ToList();
            item.DoctorPayments = item.DoctorPayments.Where(p => p.DoctorId == User.GetUserId()).ToList();
        }

        Response.AddPaginationHeader(new PaginationHeader(pagedList.CurrentPage, pagedList.PageSize,
            pagedList.TotalCount, pagedList.TotalPages));

        return pagedList;
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<PatientDto>> GetDtoByIdAsync([FromRoute] int id) {
        PatientDto? patient = await uow.PatientRepository.GetDtoByIdAsync(id);

        if (patient == null) return NotFound($"Paciente con ID {id} no fue encontrado.");

        return patient;
    }

    [HttpGet("options")]
    public async Task<ActionResult<List<OptionDto>>> GetOptionDtosAsync([FromQuery] PatientParams param) {
        param.DoctorId = User.GetUserId();
        param.UserId = User.GetUserId();
        
        return await uow.PatientRepository.GetOptionsAsync(param);
    }

    [HttpPost]
    public async Task<ActionResult<UserDto>> CreateAsync([FromBody] PatientCreateDto request)
    {
        if (string.IsNullOrEmpty(request.Email)) return BadRequest("Email es requerido.");
        if (!DateTime.TryParse(request.DateOfBirth, out DateTime dob))
        return BadRequest("Formato de fecha de nacimiento inválido");
        
        string? email = User.GetEmail();

        if (string.IsNullOrEmpty(email)) return BadRequest("Email del doctor es requerido.");
        
        if (await service.EmailExistsAsync(request.Email))
        {
            AppUser? patient = await userManager.Users
                .Include(x => x.Doctors)
                .SingleOrDefaultAsync(x => x.Email == request.Email)
            ;

            if (patient == null) return NotFound($"Paciente con email {request.Email} no fue encontrado.");

            if (string.IsNullOrEmpty(patient.Email)) return BadRequest($"Email del paciente con ID {patient.Id} es requerido.");

            if (patient.Email == email) return BadRequest($"No puedes agregar tu propio email como paciente.");

            if (patient.Doctors.Any(x => x.DoctorId == User.GetUserId()))
                return BadRequest($"El paciente con email {request.Email} ya está registrado.");

            patient.Doctors.Add(new(User.GetUserId()));

            var updateResult = await userManager.UpdateAsync(patient);

            if (!updateResult.Succeeded) return BadRequest($"Error al agregar paciente con email {request.Email}.");
        }
        else
        {
            AppUser patient = mapper.Map<PatientCreateDto, AppUser>(request);

            patient.DateOfBirth = new DateOnly(dob.Year, dob.Month, dob.Day);

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
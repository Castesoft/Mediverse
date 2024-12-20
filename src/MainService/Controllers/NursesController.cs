using AutoMapper;
using MainService.Core.DTOs.Nurses;
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
public class NursesController(
    IUnitOfWork uow, 
    UserManager<AppUser> userManager,
    IMapper mapper,
    IUsersService service
) : BaseApiController
{
    [HttpGet]
    public async Task<ActionResult<PagedList<NurseDto>>> GetPagedListAsync([FromQuery] NurseParams param)
    {
        param.DoctorId = User.GetUserId();
        param.UserId = User.GetUserId();
        
        PagedList<NurseDto> pagedList = await uow.NurseRepository.GetPagedListAsync(param);

        Response.AddPaginationHeader(new PaginationHeader(pagedList.CurrentPage, pagedList.PageSize,
            pagedList.TotalCount, pagedList.TotalPages));

        return pagedList;
    }

    [HttpGet("options")]
    public async Task<ActionResult<List<OptionDto>>> GetOptionDtosAsync([FromQuery] NurseParams param) {
        param.DoctorId = User.GetUserId();
        param.UserId = User.GetUserId();
        
        return await uow.NurseRepository.GetOptionsAsync(param);
    }

    [HttpPost]
    public async Task<ActionResult<UserDto>> CreateAsync([FromBody] NurseCreateDto request)
    {
        if (string.IsNullOrEmpty(request.Email)) return BadRequest("Email es requerido.");
        
        string? email = User.GetEmail();

        if (string.IsNullOrEmpty(email)) return BadRequest("Email del doctor es requerido.");
        
        if (await service.EmailExistsAsync(request.Email))
        {
            AppUser? nurse = await userManager.Users
                .Include(x => x.Doctors)
                .SingleOrDefaultAsync(x => x.Email == request.Email)
            ;

            if (nurse == null) return NotFound($"Paciente con email {request.Email} no fue encontrado.");

            if (string.IsNullOrEmpty(nurse.Email)) return BadRequest($"Email del paciente con ID {nurse.Id} es requerido.");

            if (nurse.Email == email) return BadRequest($"No puedes agregar tu propio email como paciente.");

            if (nurse.Doctors.Any(x => x.DoctorId == User.GetUserId()))
                return BadRequest($"El paciente con email {request.Email} ya está registrado.");

            nurse.Doctors.Add(new(User.GetUserId()));

            var updateResult = await userManager.UpdateAsync(nurse);

            if (!updateResult.Succeeded) return BadRequest($"Error al agregar paciente con email {request.Email}.");
        }
        else
        {
            var nurse = mapper.Map<AppUser>(request);

            var createResult = await userManager.CreateAsync(nurse, "Pa$$w0rd");

            if (!createResult.Succeeded) return BadRequest($"Error al crear paciente con email {request.Email}.");

            var roleResult = await userManager.AddToRoleAsync(nurse, "Nurse");

            if (!roleResult.Succeeded) return BadRequest($"Error al agregar paciente con email {request.Email}.");

            nurse.Doctors.Add(new(User.GetUserId()));

            var updateResult = await userManager.UpdateAsync(nurse);

            if (!updateResult.Succeeded) return BadRequest($"Error al agregar paciente a la lista de pacientes del doctor.");

        }
        var nurseToReturn = await uow.UserRepository.GetDtoByEmailAsync(request.Email);

        return Ok(nurseToReturn);
    }
}
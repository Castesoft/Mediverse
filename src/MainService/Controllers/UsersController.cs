using MainService.Core.DTOs;
using MainService.Core.DTOs.User;
using MainService.Core.Helpers.Pagination;
using MainService.Core.Helpers.Params;
using MainService.Core.Interfaces.Services;
using MainService.Extensions;
using MainService.Infrastructure.Services;
using MainService.Models.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace MainService.Controllers;

public class UsersController(IUnitOfWork uow, UsersService usersService, UserManager<AppUser> userManager) : BaseApiController
{
    private static readonly string subject = "usuario";
    private static readonly string subjectArticle = "El";

        
    [Authorize(Policy = "RequireAdminRole")]
    public async Task<ActionResult<PagedList<UserDto>>> GetPagedListAsync([FromQuery] UserParams param)
    {
        var pagedList = await uow.UserRepository.GetPagedListAsync(param, User);

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

        if (item == null) return NotFound($"{subjectArticle} {subject} de ID {id} no fue encontrado.");

        return item;
    }

    [Authorize(Policy = "RequireAdminRole")]
    [HttpDelete("{id}")]
    public async Task<ActionResult> DeleteByIdAsync(int id)
    {
        var item = await uow.UserRepository.GetByIdAsNoTrackingAsync(id);

        if (item == null) return NotFound($"{subjectArticle} {subject} de ID {id} no fue encontrado.");

        var deleteResult = await usersService.DeleteAsync(item);

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

            var deleteResult = await usersService.DeleteAsync(itemToDelete);

            if (!deleteResult) return BadRequest($"Error al eliminar {subject} de {itemToDelete.Email}.");
        }
        
        return Ok();
    }

    [Authorize(Policy = "RequireAdminRole")]
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

    [HttpGet("prescription-information/{doctorId}")]
    public async Task<ActionResult<PrescriptionInformationDto>> GetPrescriptionInformation([FromRoute] int doctorId)
    {
        var item = await uow.UserRepository.GetPrescriptionInformationAsync(doctorId);

        return item;
    }
}

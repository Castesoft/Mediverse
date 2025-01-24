using MainService.Core.Interfaces.Services;
using Microsoft.AspNetCore.Mvc;

namespace MainService.Controllers;

public class RolesController(IUnitOfWork uow) : BaseApiController
{
    [HttpGet("options")]
    public async Task<IActionResult> GetRoles()
    {
        return Ok(await uow.RoleRepository.GetUserRoles());
    }
}
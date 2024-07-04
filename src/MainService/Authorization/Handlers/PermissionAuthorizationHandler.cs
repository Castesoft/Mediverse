using System.Security.Claims;
using MainService.Core.Interfaces.Services;
using MainService.Errors;
using Microsoft.AspNetCore.Authorization;

namespace MainService.Authorization.Handlers;
public class PermissionAuthorizationHandler : AuthorizationHandler<PermissionRequirement>
{
    private readonly IPermissionManager _permissionManager;
    public PermissionAuthorizationHandler(IPermissionManager permissionManager)
    {
        _permissionManager = permissionManager;
    }

    protected override async Task HandleRequirementAsync(AuthorizationHandlerContext context, PermissionRequirement requirement)
    {
        var permissionsClaim = context.User.Claims.FirstOrDefault(c => c.Value == requirement.Permission);

        if (permissionsClaim != null)
        {
            context.Succeed(requirement);
        }
        else
        {
            string permissionDescription = await _permissionManager.GetPermissionDescriptionByName(requirement.Permission);
            string email = context.User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.Email)?.Value;

            throw new PermissionDeniedException(email, permissionDescription);
        }

        await Task.CompletedTask;
    }
}
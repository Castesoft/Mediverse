using Microsoft.AspNetCore.Authorization;
using Serilog;
using MainService.Core.Extensions;

namespace MainService.Authorization.Handlers;

public class PermissionAuthorizationHandler : AuthorizationHandler<PermissionRequirement>
{
    protected override Task HandleRequirementAsync(AuthorizationHandlerContext context, PermissionRequirement requirement)
    {
        var permissionsClaim =
            context.User.Claims.FirstOrDefault(c => c.Type == "permission" && c.Value == requirement.Permission);

        if (permissionsClaim != null)
        {
            Log.Debug("Permission '{PermissionName}' found for User {UserId}. Succeeding requirement.", requirement.Permission, context.User?.GetUserId() ?? 0);
            context.Succeed(requirement);
        }
        else
        {
            Log.Warning("Permission '{PermissionName}' NOT FOUND for User {UserId}. Failing requirement.", requirement.Permission, context.User?.GetUserId() ?? 0);
            context.Fail();
        }

        return Task.CompletedTask;
    }
}
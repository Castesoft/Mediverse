using MainService.Core.Extensions;
using MainService.Models.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Authorization.Infrastructure;
using Serilog;

namespace MainService.Authorization.Handlers;

public class WarehouseAuthorizationHandler : AuthorizationHandler<OperationAuthorizationRequirement, Warehouse>
{
    protected override Task HandleRequirementAsync(
        AuthorizationHandlerContext context,
        OperationAuthorizationRequirement requirement,
        Warehouse resource)
    {
        if (context.User == null || !context.User.Identity!.IsAuthenticated)
        {
            Log.Warning("Authorization failed for Warehouse {WarehouseId}: User not authenticated.", resource.Id);
            context.Fail();
            return Task.CompletedTask;
        }

        var userId = context.User.GetUserId();
        if (userId <= 0)
        {
            Log.Warning("Authorization failed for Warehouse {WarehouseId}: Requesting User ID not found.", resource.Id);
            context.Fail();
            return Task.CompletedTask;
        }

        if (context.User.IsInRole("Admin"))
        {
            Log.Information("Admin authorization granted for User {AdminUserId} on Warehouse {WarehouseId} for Requirement {RequirementName}", userId, resource.Id, requirement.Name);
            context.Succeed(requirement);
            return Task.CompletedTask;
        }

        Log.Warning("Authorization DENIED for User {RequestingUserId} on Warehouse {WarehouseId}: User is not an Admin.", userId, resource.Id);
        context.Fail();
        return Task.CompletedTask;
    }
}
using MainService.Authorization.Operations;
using MainService.Core.Extensions;
using MainService.Models.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Authorization.Infrastructure;
using Serilog;

namespace MainService.Authorization.Handlers
{
    public class UserAddressAuthorizationHandler : AuthorizationHandler<OperationAuthorizationRequirement, UserAddress>
    {
        protected override Task HandleRequirementAsync(
            AuthorizationHandlerContext context,
            OperationAuthorizationRequirement requirement,
            UserAddress resource)
        {
            if (context.User == null || !context.User.Identity!.IsAuthenticated)
            {
                Log.Warning("Authorization failed for UserAddress {AddressId} (User {TargetUserId}): User not authenticated.", resource.AddressId, resource.UserId);
                context.Fail();
                return Task.CompletedTask;
            }

            var userId = context.User.GetUserId();
            if (userId <= 0)
            {
                Log.Warning("Authorization failed for UserAddress {AddressId} (User {TargetUserId}): Requesting User ID not found.", resource.AddressId, resource.UserId);
                context.Fail();
                return Task.CompletedTask;
            }

            if (context.User.IsInRole("Admin"))
            {
                Log.Information("Admin authorization granted for User {AdminUserId} on UserAddress {AddressId} (User {TargetUserId}) for Requirement {RequirementName}", userId, resource.AddressId, resource.UserId, requirement.Name);
                context.Succeed(requirement);
                return Task.CompletedTask;
            }

            bool isAuthorized = false;

            if (resource.UserId == userId)
            {
                switch (requirement.Name)
                {
                    case nameof(UserAddressOperations.Read):
                    case nameof(UserAddressOperations.Create):
                    case nameof(UserAddressOperations.Update):
                    case nameof(UserAddressOperations.Delete):
                    case nameof(UserAddressOperations.SetMain):
                    case nameof(UserAddressOperations.SetBilling):
                        isAuthorized = true;
                        break;
                    default:
                        Log.Warning("Unhandled requirement {RequirementName} for UserAddress {AddressId} (User {TargetUserId}) by User {RequestingUserId}", requirement.Name, resource.AddressId, resource.UserId, userId);
                        break;
                }
            }
            else
            {
                Log.Warning("Authorization DENIED for User {RequestingUserId} on UserAddress {AddressId} (User {TargetUserId}): User is not the owner.", userId, resource.AddressId, resource.UserId);
            }

            if (isAuthorized)
            {
                Log.Information("Authorization SUCCEEDED for User {UserId} requirement {RequirementName} on UserAddress {AddressId} (User {TargetUserId})", userId, requirement.Name, resource.AddressId, resource.UserId);
                context.Succeed(requirement);
            }
            else
            {
                context.Fail();
            }

            return Task.CompletedTask;
        }
    }
}
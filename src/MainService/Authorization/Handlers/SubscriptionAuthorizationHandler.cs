using MainService.Authorization.Operations;
using MainService.Core.Extensions;
using MainService.Models.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Authorization.Infrastructure;
using Serilog;

namespace MainService.Authorization.Handlers
{
    public class SubscriptionAuthorizationHandler : AuthorizationHandler<OperationAuthorizationRequirement, UserSubscription>
    {
        protected override Task HandleRequirementAsync(
            AuthorizationHandlerContext context,
            OperationAuthorizationRequirement requirement,
            UserSubscription resource)
        {
            if (context.User == null || !context.User.Identity!.IsAuthenticated)
            {
                Log.Warning("Authorization failed for UserSubscription {SubscriptionId} (User {TargetUserId}): User not authenticated.", resource.Id, resource.UserId);
                context.Fail();
                return Task.CompletedTask;
            }

            var userId = context.User.GetUserId();
            if (userId <= 0)
            {
                Log.Warning("Authorization failed for UserSubscription {SubscriptionId} (User {TargetUserId}): Requesting User ID not found.", resource.Id, resource.UserId);
                context.Fail();
                return Task.CompletedTask;
            }
            
            if (context.User.IsInRole("Admin"))
            {
                Log.Information("Admin authorization granted for User {AdminUserId} on UserSubscription {SubscriptionId} (User {TargetUserId}) for Requirement {RequirementName}", userId, resource.Id, resource.UserId, requirement.Name);
                context.Succeed(requirement);
                return Task.CompletedTask;
            }

            bool isAuthorized = false;
            
            if (resource.UserId == userId)
            {
                switch (requirement.Name)
                {
                    case nameof(SubscriptionOperations.Read):
                    case nameof(SubscriptionOperations.Create): 
                    case nameof(SubscriptionOperations.Cancel):
                    case nameof(SubscriptionOperations.ReadHistory): 
                        isAuthorized = true;
                        break;
                    default:
                        Log.Warning("Unhandled requirement {RequirementName} for UserSubscription {SubscriptionId} (User {TargetUserId}) by User {RequestingUserId}", requirement.Name, resource.Id, resource.UserId, userId);
                        break;
                }
            }
            else
            {
                 Log.Warning("Authorization DENIED for User {RequestingUserId} on UserSubscription {SubscriptionId} (User {TargetUserId}): User is not the owner.", userId, resource.Id, resource.UserId);
            }

            if (isAuthorized)
            {
                 Log.Information("Authorization SUCCEEDED for User {UserId} requirement {RequirementName} on UserSubscription {SubscriptionId} (User {TargetUserId})", userId, requirement.Name, resource.Id, resource.UserId);
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
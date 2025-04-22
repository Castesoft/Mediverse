using MainService.Models.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Authorization.Infrastructure;
using MainService.Core.Extensions;
using MainService.Authorization.Operations;

namespace MainService.Authorization.Handlers
{
    public class NotificationAuthorizationHandler(ILogger<NotificationAuthorizationHandler> logger) : AuthorizationHandler<OperationAuthorizationRequirement, UserNotification>
    {
        protected override Task HandleRequirementAsync(
            AuthorizationHandlerContext context,
            OperationAuthorizationRequirement requirement,
            UserNotification resource) 
        {
            var resourceIdentifier = $"(User: {resource.AppUserId}, Notification: {resource.NotificationId})";

            if (context.User == null || !context.User.Identity!.IsAuthenticated)
            {
                logger.LogWarning("Authorization failed for UserNotification {ResourceIdentifier}: User not authenticated.", resourceIdentifier);
                context.Fail();
                return Task.CompletedTask;
            }

            var userId = context.User.GetUserId();
            if (userId <= 0)
            { 
                logger.LogWarning("Authorization failed for UserNotification {ResourceIdentifier}: User ID not found in claims.", resourceIdentifier);
                context.Fail();
                return Task.CompletedTask;
            }

            var isAuthorized = false;

            if (resource.AppUserId == userId)
            {
                switch (requirement.Name)
                {
                    case nameof(NotificationOperations.Read): 
                    case nameof(NotificationOperations.UpdateStatus):
                        isAuthorized = true;
                        break;
                    default:
                        logger.LogWarning("Unhandled requirement {RequirementName} for UserNotification {ResourceIdentifier} by User {UserId}", requirement.Name, resourceIdentifier, userId);
                        break;
                }
            }
            else
            {
                logger.LogWarning("Authorization DENIED for User {UserId} on UserNotification {ResourceIdentifier}: Notification belongs to User {OwnerUserId}.", userId, resourceIdentifier, resource.AppUserId);
            }


            if (isAuthorized)
            {
                logger.LogInformation("Authorization SUCCEEDED for User {UserId} requirement {RequirementName} on UserNotification {ResourceIdentifier}", userId, requirement.Name, resourceIdentifier);
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
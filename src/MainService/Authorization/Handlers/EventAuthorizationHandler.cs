using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Authorization.Infrastructure;
using MainService.Core.Interfaces.Services;
using MainService.Models.Entities;
using MainService.Authorization.Operations;
using MainService.Core.Extensions;

namespace MainService.Authorization.Handlers;

/// <summary>
/// Handles authorization requirements for specific Event resources based on user relationship.
/// </summary>
public class EventAuthorizationHandler(IEventsService eventsService, ILogger<EventAuthorizationHandler> logger)
    : AuthorizationHandler<OperationAuthorizationRequirement, Event>
{
    protected override async Task HandleRequirementAsync(
        AuthorizationHandlerContext context,
        OperationAuthorizationRequirement requirement,
        Event resource) // The specific Event instance being accessed
    {
        if (context.User == null || !context.User.Identity.IsAuthenticated)
        {
            logger.LogWarning("Authorization failed: User is not authenticated.");
            context.Fail();
            return;
        }

        var userId = context.User.GetUserId();
        if (userId <= 0)
        {
            logger.LogWarning("Authorization failed: User ID not found or invalid in claims.");
            context.Fail();
            return;
        }

        logger.LogDebug("Evaluating requirement {RequirementName} for User {UserId} on Event {EventId}", requirement.Name, userId, resource.Id);

        var isAuthorized = false;

        switch (requirement.Name)
        {
            case nameof(EventOperations.Read):
                isAuthorized = await eventsService.CanUserAccessEventAsync(userId, resource.Id);
                if (!isAuthorized) logger.LogWarning("Authorization DENIED for User {UserId} to READ Event {EventId}", userId, resource.Id);
                break;

            case nameof(EventOperations.Update):
            case nameof(EventOperations.UpdateEvolution):
            case nameof(EventOperations.UpdateNextSteps):
                isAuthorized = await eventsService.CanModifyEventAsync(userId, resource.Id);
                if (!isAuthorized) logger.LogWarning("Authorization DENIED for User {UserId} to UPDATE/MODIFY Event {EventId} (Operation: {RequirementName})", userId, resource.Id, requirement.Name);
                break;

            case nameof(EventOperations.Delete):
                isAuthorized = await eventsService.CanDeleteEventAsync(userId, resource.Id);
                if (!isAuthorized) logger.LogWarning("Authorization DENIED for User {UserId} to DELETE Event {EventId}", userId, resource.Id);
                break;

            case nameof(EventOperations.Pay):
                isAuthorized = await eventsService.CanPatientAccessEventAsync(userId, resource.Id);
                if (!isAuthorized) logger.LogWarning("Authorization DENIED for User {UserId} to PAY for Event {EventId}", userId, resource.Id);
                break;

            // TODO - Cancel operation

            default:
                logger.LogWarning("Authorization requirement {RequirementName} is not handled by EventAuthorizationHandler for Event {EventId}.", requirement.Name, resource.Id);
                isAuthorized = false;
                break;
        }

        if (isAuthorized)
        {
            logger.LogInformation("Authorization SUCCEEDED for User {UserId} requirement {RequirementName} on Event {EventId}", userId, requirement.Name, resource.Id);
            context.Succeed(requirement);
        }
        else
        {
            logger.LogDebug("Authorization final result: FAILED for User {UserId} requirement {RequirementName} on Event {EventId}", userId, requirement.Name, resource.Id);
        }

        await Task.CompletedTask;
    }
}
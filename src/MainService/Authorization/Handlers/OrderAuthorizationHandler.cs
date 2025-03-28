using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Authorization.Infrastructure;
using MainService.Core.Interfaces.Services;
using MainService.Models.Entities;
using MainService.Authorization.Operations;
using MainService.Core.Extensions;

namespace MainService.Authorization.Handlers;

/// <summary>
/// Handles authorization requirements for specific Order resources based on user relationship.
/// </summary>
public class OrderAuthorizationHandler(IUnitOfWork uow, ILogger<OrderAuthorizationHandler> logger)
    : AuthorizationHandler<OperationAuthorizationRequirement, Order>
{
    protected override async Task HandleRequirementAsync(
        AuthorizationHandlerContext context,
        OperationAuthorizationRequirement requirement,
        Order resource)
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

        logger.LogDebug("Evaluating requirement {RequirementName} for User {UserId} on Order {OrderId}", requirement.Name, userId, resource.Id);

        var isAuthorized = false;

        if (context.User.IsInRole("Admin"))
        {
            logger.LogInformation("Admin authorization granted for User {UserId} on Order {OrderId}", userId, resource.Id);
            context.Succeed(requirement);
            return;
        }

        switch (requirement.Name)
        {
            case nameof(OrderOperations.Read):
                // Check if the user is related to the order (either as a patient or a doctor)
                isAuthorized = resource.PatientOrder?.PatientId == userId || resource.DoctorOrder?.DoctorId == userId;
                break;

            case nameof(OrderOperations.Update):
                // Only allow updates by the related doctor or patient
                isAuthorized = resource.PatientOrder?.PatientId == userId || resource.DoctorOrder?.DoctorId == userId;
                break;

            case nameof(OrderOperations.Delete):
                // Only allow deletion by the related doctor or admin
                isAuthorized = resource.DoctorOrder?.DoctorId == userId && context.User.IsInRole("Doctor");
                break;

            case nameof(OrderOperations.Approve):
                // Only allow approval by the related doctor
                isAuthorized = resource.DoctorOrder?.DoctorId == userId && context.User.IsInRole("Doctor");
                break;

            default:
                logger.LogWarning("Authorization requirement {RequirementName} is not handled by OrderAuthorizationHandler for Order {OrderId}.", requirement.Name, resource.Id);
                isAuthorized = false;
                break;
        }

        if (isAuthorized)
        {
            logger.LogInformation("Authorization SUCCEEDED for User {UserId} requirement {RequirementName} on Order {OrderId}", userId, requirement.Name, resource.Id);
            context.Succeed(requirement);
        }
        else
        {
            logger.LogDebug("Authorization final result: FAILED for User {UserId} requirement {RequirementName} on Order {OrderId}", userId, requirement.Name, resource.Id);
        }
    }
}
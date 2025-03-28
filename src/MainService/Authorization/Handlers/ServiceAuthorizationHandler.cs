using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Authorization.Infrastructure;
using MainService.Models.Entities;
using MainService.Authorization.Operations;
using MainService.Core.Extensions;

namespace MainService.Authorization.Handlers
{
    /// <summary>
    /// Handles authorization requirements for Service resources based on user roles and ownership.
    /// - Admins: Full access.
    /// - Doctors: Can only manage services they own (DoctorService.DoctorId == userId)
    /// - Other Users: Can read services they have access to.
    /// </summary>
    public class ServiceAuthorizationHandler(ILogger<ServiceAuthorizationHandler> logger) : AuthorizationHandler<OperationAuthorizationRequirement, Service>
    {
        protected override Task HandleRequirementAsync(AuthorizationHandlerContext context, OperationAuthorizationRequirement requirement, Service resource)
        {
            // Basic authentication checks
            if (context.User == null || !context.User.Identity.IsAuthenticated)
            {
                context.Fail();
                return Task.CompletedTask;
            }

            var userId = context.User.GetUserId();
            if (userId <= 0)
            {
                context.Fail();
                return Task.CompletedTask;
            }

            logger.LogDebug("Evaluating {RequirementName} for User:{UserId} on Service:{ServiceId}", requirement.Name, userId, resource.Id);

            if (context.User.IsInRole("Admin"))
            {
                logger.LogInformation("ADMIN User:{UserId} granted {RequirementName} on Service:{ServiceId}", userId, requirement.Name, resource.Id);
                context.Succeed(requirement);
                return Task.CompletedTask;
            }

            switch (requirement.Name)
            {
                case nameof(ServiceOperations.Read):
                    if (context.User.IsInRole("Doctor"))
                    {
                        var doctorHasAccess = resource.DoctorService?.DoctorId == userId;
                        if (doctorHasAccess)
                        {
                            logger.LogInformation("Doctor:{UserId} granted Read access to Service:{ServiceId}", userId, resource.Id);
                            context.Succeed(requirement);
                        }
                        else
                        {
                            logger.LogWarning("Read access DENIED for Doctor:{UserId} on Service:{ServiceId} - Not owner", userId, resource.Id);
                        }
                    }
                    else
                    {
                        context.Succeed(requirement);
                    }
                    break;

                case nameof(ServiceOperations.Create):
                    if (context.User.IsInRole("Doctor"))
                    {
                        context.Succeed(requirement);
                    }
                    break;

                case nameof(ServiceOperations.Update):
                case nameof(ServiceOperations.Delete):
                    if (context.User.IsInRole("Doctor"))
                    {
                        var doctorHasAccess = resource.DoctorService.DoctorId == userId;
                        if (doctorHasAccess)
                        {
                            context.Succeed(requirement);
                        }
                        else
                        {
                            logger.LogWarning("Authorization FAILED for Doctor:{UserId} on Service:{ServiceId} ({RequirementName}) - Not owner", userId, resource.Id, requirement.Name);
                        }
                    }
                    break;

                default:
                    logger.LogWarning("Unhandled requirement: {RequirementName} for Service:{ServiceId}", requirement.Name, resource.Id);
                    break;
            }

            if (!context.HasSucceeded)
            {
                logger.LogWarning("Authorization FAILED for User:{UserId} on Service:{ServiceId} ({RequirementName})", userId, resource.Id, requirement.Name);
            }

            return Task.CompletedTask;
        }
    }
}

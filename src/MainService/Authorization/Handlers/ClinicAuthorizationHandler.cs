using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Authorization.Infrastructure;
using MainService.Core.Interfaces.Services;
using MainService.Models.Entities;
using MainService.Authorization.Operations;
using MainService.Core.Extensions;

namespace MainService.Authorization.Handlers
{
    /// <summary>
    /// Handles authorization requirements for specific Clinic resources based on user relationship.
    /// </summary>
    public class ClinicAuthorizationHandler(IUnitOfWork uow, ILogger<ClinicAuthorizationHandler> logger) : AuthorizationHandler<OperationAuthorizationRequirement, Address>
    {
        protected override async Task HandleRequirementAsync(
            AuthorizationHandlerContext context,
            OperationAuthorizationRequirement requirement,
            Address resource)
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

            logger.LogDebug("Evaluating requirement {RequirementName} for User {UserId} on Clinic {ClinicId}", requirement.Name, userId, resource.Id);

            var isAuthorized = false;

            // Check if the user is an admin (they have full access)
            if (context.User.IsInRole("Admin"))
            {
                logger.LogInformation("Admin authorization granted for User {UserId} on Clinic {ClinicId}", userId, resource.Id);
                context.Succeed(requirement);
                return;
            }

            switch (requirement.Name)
            {
                case nameof(ClinicOperations.Read):
                    // Anyone can read a clinic
                    isAuthorized = true;
                    break;

                case nameof(ClinicOperations.Create):
                    // Only doctors can create clinics
                    isAuthorized = context.User.IsInRole("Doctor");
                    break;

                case nameof(ClinicOperations.Update):
                case nameof(ClinicOperations.Delete):
                case nameof(ClinicOperations.ManageNurses):
                case nameof(ClinicOperations.ManagePhotos):
                    // Check if the user is the doctor who owns this clinic
                    isAuthorized = await uow.ClinicRepository.DoctorHasAddressAsync(userId, resource.Id);

                    // Also allow nurses assigned to this clinic to update it if they're in Nurse role
                    if (!isAuthorized && context.User.IsInRole("Nurse") && requirement.Name == nameof(ClinicOperations.Update))
                    {
                        // Check if the nurse is assigned to this clinic
                        isAuthorized = resource.ClinicNurses != null && resource.ClinicNurses.Any(cn => cn.NurseId == userId);
                    }

                    break;

                default:
                    logger.LogWarning("Authorization requirement {RequirementName} is not handled by ClinicAuthorizationHandler for Clinic {ClinicId}.", requirement.Name, resource.Id);
                    isAuthorized = false;
                    break;
            }

            if (isAuthorized)
            {
                logger.LogInformation("Authorization SUCCEEDED for User {UserId} requirement {RequirementName} on Clinic {ClinicId}", userId, requirement.Name, resource.Id);
                context.Succeed(requirement);
            }
            else
            {
                logger.LogDebug("Authorization final result: FAILED for User {UserId} requirement {RequirementName} on Clinic {ClinicId}", userId, requirement.Name, resource.Id);
            }
        }
    }
}
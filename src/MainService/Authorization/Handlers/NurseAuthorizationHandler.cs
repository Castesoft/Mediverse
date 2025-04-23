using MainService.Models.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Authorization.Infrastructure;
using MainService.Core.Extensions;
using MainService.Authorization.Operations;
using Serilog;

namespace MainService.Authorization.Handlers;

public class NurseAuthorizationHandler(ILogger<NurseAuthorizationHandler> logger) : AuthorizationHandler<OperationAuthorizationRequirement, DoctorNurse> 
{
    protected override async Task HandleRequirementAsync(
        AuthorizationHandlerContext context,
        OperationAuthorizationRequirement requirement,
        DoctorNurse resource) 
    {
        
        if (context.User == null || !context.User.Identity!.IsAuthenticated)
        {
            context.Fail();
            return;
        }

        var userId = context.User.GetUserId();
        if (userId <= 0)
        {
            logger.LogWarning("Authorization failed for DoctorNurse (Doctor {DoctorId}, Nurse {NurseId}): User ID not found.", resource.DoctorId, resource.NurseId);
            context.Fail();
            return;
        }

        if (context.User.IsInRole("Admin"))
        {
            logger.LogWarning("Admin authorization granted for User {UserId} on DoctorNurse (Doctor {DoctorId}, Nurse {NurseId}) for Requirement {RequirementName}", userId, resource.DoctorId, resource.NurseId, requirement.Name);
            context.Succeed(requirement);
            return;
        }

        bool isAuthorized = false;
        
        if (resource.DoctorId == userId && context.User.IsInRole("Doctor"))
        {
            switch (requirement.Name)
            {
                
                case nameof(NurseOperations.DeleteAssociation):
                    isAuthorized = true;
                    break;
                case nameof(NurseOperations.ReadAssociation): 
                case nameof(NurseOperations.CreateAssociation): 
                    isAuthorized = true; 
                    break;
                default:
                    logger.LogWarning("Unhandled requirement {RequirementName} for DoctorNurse (Doctor {DoctorId}, Nurse {NurseId}) by Doctor {UserId}", requirement.Name, resource.DoctorId, resource.NurseId, userId);
                    break;
            }
        }
        else
        {
            logger.LogWarning("Authorization DENIED for User {UserId} on DoctorNurse (Doctor {DoctorId}, Nurse {NurseId}): User is not the associated Doctor or not in Doctor role.", userId, resource.DoctorId, resource.NurseId);
            logger.LogWarning("Available user roles for User {UserId}: {Roles}", userId, string.Join(", ", context.User.Claims.Where(c => c.Type == "role").Select(c => c.Value)));
        }


        if (isAuthorized)
        {
            logger.LogInformation("Authorization SUCCEEDED for Doctor {UserId} requirement {RequirementName} on DoctorNurse (Doctor {DoctorId}, Nurse {NurseId})", userId, requirement.Name, resource.DoctorId, resource.NurseId);
            context.Succeed(requirement);
        }
        else
        {
            context.Fail();
        }

        await Task.CompletedTask; 
    }
}
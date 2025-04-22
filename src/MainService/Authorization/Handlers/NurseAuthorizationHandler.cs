using MainService.Models.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Authorization.Infrastructure;
using MainService.Core.Extensions;
using MainService.Authorization.Operations;
using Serilog;

namespace MainService.Authorization.Handlers;

public class NurseAuthorizationHandler : AuthorizationHandler<OperationAuthorizationRequirement, DoctorNurse> 
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
            Log.Warning("Authorization failed for DoctorNurse (Doctor {DoctorId}, Nurse {NurseId}): User ID not found.", resource.DoctorId, resource.NurseId);
            context.Fail();
            return;
        }

        if (context.User.IsInRole("Admin"))
        {
            Log.Information("Admin authorization granted for User {UserId} on DoctorNurse (Doctor {DoctorId}, Nurse {NurseId}) for Requirement {RequirementName}", userId, resource.DoctorId, resource.NurseId, requirement.Name);
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
                    Log.Warning("Unhandled requirement {RequirementName} for DoctorNurse (Doctor {DoctorId}, Nurse {NurseId}) by Doctor {UserId}", requirement.Name, resource.DoctorId, resource.NurseId, userId);
                    break;
            }
        }
        else
        {
            Log.Warning("Authorization DENIED for User {UserId} on DoctorNurse (Doctor {DoctorId}, Nurse {NurseId}): User is not the associated Doctor or not in Doctor role.", userId, resource.DoctorId, resource.NurseId);
        }


        if (isAuthorized)
        {
            Log.Information("Authorization SUCCEEDED for Doctor {UserId} requirement {RequirementName} on DoctorNurse (Doctor {DoctorId}, Nurse {NurseId})", userId, requirement.Name, resource.DoctorId, resource.NurseId);
            context.Succeed(requirement);
        }
        else
        {
            context.Fail();
        }

        await Task.CompletedTask; 
    }
}
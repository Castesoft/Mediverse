using MainService.Models.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Authorization.Infrastructure;
using MainService.Core.Extensions;
using MainService.Authorization.Operations;
using Serilog;

namespace MainService.Authorization.Handlers
{
    public class PatientAuthorizationHandler : AuthorizationHandler<OperationAuthorizationRequirement, DoctorPatient> 
    {
        protected override async Task HandleRequirementAsync(
            AuthorizationHandlerContext context,
            OperationAuthorizationRequirement requirement,
            DoctorPatient resource) 
        {
            if (context.User == null || !context.User.Identity!.IsAuthenticated)
            {
                Log.Warning("Authorization failed for DoctorPatient (Doctor {DoctorId}, Patient {PatientId}): User not authenticated.", resource.DoctorId, resource.PatientId);
                context.Fail();
                return;
            }

            var userId = context.User.GetUserId();
            if (userId <= 0)
            {
                Log.Warning("Authorization failed for DoctorPatient (Doctor {DoctorId}, Patient {PatientId}): User ID not found.", resource.DoctorId, resource.PatientId);
                context.Fail();
                return;
            }
            
            if (context.User.IsInRole("Admin"))
            {
                Log.Information("Admin authorization granted for User {UserId} on DoctorPatient (Doctor {DoctorId}, Patient {PatientId}) for Requirement {RequirementName}", userId, resource.DoctorId, resource.PatientId, requirement.Name);
                context.Succeed(requirement);
                return;
            }

            bool isAuthorized = false;

            
            if (resource.DoctorId == userId && context.User.IsInRole("Doctor"))
            {
                switch (requirement.Name)
                {
                    case nameof(PatientOperations.ReadDetails):
                    case nameof(PatientOperations.DeleteAssociation):
                    
                    case nameof(PatientOperations.ManageMedicalRecord):
                        isAuthorized = true;
                        break;
                    default:
                        Log.Warning("Unhandled requirement {RequirementName} for DoctorPatient (Doctor {DoctorId}, Patient {PatientId}) by Doctor {UserId}", requirement.Name, resource.DoctorId, resource.PatientId, userId);
                        break;
                }
            }
            
            
            else
            {
                Log.Warning("Authorization DENIED for User {UserId} on DoctorPatient (Doctor {DoctorId}, Patient {PatientId}): User is not the associated Doctor or not in Doctor role.", userId, resource.DoctorId, resource.PatientId);
            }


            if (isAuthorized)
            {
                Log.Information("Authorization SUCCEEDED for Doctor {UserId} requirement {RequirementName} on DoctorPatient (Doctor {DoctorId}, Patient {PatientId})", userId, requirement.Name, resource.DoctorId, resource.PatientId);
                context.Succeed(requirement);
            }
            else
            {
                
                context.Fail();
            }

            await Task.CompletedTask; 
        }
    }
}
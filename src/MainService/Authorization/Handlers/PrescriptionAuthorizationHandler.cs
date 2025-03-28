using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Authorization.Infrastructure;
using MainService.Models.Entities;
using MainService.Authorization.Operations;
using MainService.Core.Extensions;
using Serilog;

namespace MainService.Authorization.Handlers
{
    /// <summary>
    /// Handles authorization requirements for Prescription resources.
    /// - Admins: Full access
    /// - Doctors: Can create. Can only access/delete prescriptions they created (Read/Delete)
    /// - Patients: Can only access prescriptions prescribed to them (Read)
    /// - Prescriptions cannot be modified after creation (Update always fails unless Admin)
    /// NOTE: Assumes this handler IS invoked even when resource is null for the Create operation
    /// (requires controller to call AuthorizeAsync with null resource for Create).
    /// </summary>
    // Reverted signature to accept nullable Prescription
    public class
        PrescriptionAuthorizationHandler : AuthorizationHandler<OperationAuthorizationRequirement, Prescription?>
    {
        // Reverted resource parameter to be nullable
        protected override async Task HandleRequirementAsync(AuthorizationHandlerContext context,
            OperationAuthorizationRequirement requirement, Prescription? resource)
        {
            // Log invocation attempt
            Log.Information("Authorization handler invoked for operation: {Operation} (Resource ID: {ResourceId})", requirement.Name, resource?.Id.ToString() ?? "null");

            if (context.User == null || !context.User.Identity.IsAuthenticated)
            {
                Log.Warning("Authorization failed: User is not authenticated.");
                context.Fail(new AuthorizationFailureReason(this, "User is not authenticated."));
                return;
            }

            var userId = context.User.GetUserId();
            if (userId <= 0)
            {
                Log.Warning("Authorization failed: User ID not found or invalid in claims.");
                context.Fail(new AuthorizationFailureReason(this, "User ID not found or invalid in claims."));
                return;
            }

            if (requirement.Name == nameof(PrescriptionOperations.Create) && resource == null)
            {
                Log.Debug("Evaluating CREATE requirement for User {UserId} (Resource is null as expected for Create)", userId);
            }
            else if (resource == null)
            {
                Log.Warning("Authorization failed: Resource is null for non-CREATE operation {Operation}. User {UserId}", requirement.Name, userId);
                context.Fail(new AuthorizationFailureReason(this, $"Resource cannot be null for operation {requirement.Name}."));
                return;
            }
            else
            {
                Log.Debug(
                    "Evaluating requirement {RequirementName} for User {UserId} on Prescription {PrescriptionId}",
                    requirement.Name, userId, resource.Id);
            }


            if (context.User.IsInRole("Admin"))
            {
                Log.Information("Admin authorization granted for User {UserId} for operation {Operation} (Resource ID: {ResourceId})", userId, requirement.Name, resource?.Id.ToString() ?? "null");
                context.Succeed(requirement);
                return;
            }

            var isAuthorized = false;
            var resourceIdForLog = resource?.Id ?? 0;
            string failureReason =
                $"User {userId} is not authorized for operation {requirement.Name} on Prescription {resourceIdForLog}";

            switch (requirement.Name)
            {
                case nameof(PrescriptionOperations.Create):
                    Log.Information("Processing CREATE operation authorization check for user {UserId}", userId);

                    // Check if user has the 'Doctor' role
                    isAuthorized = context.User.IsInRole("Doctor");

                    if (isAuthorized)
                    {
                        Log.Debug("CREATE authorization granted for User {UserId} - User is a Doctor", userId);
                    }
                    else
                    {
                        failureReason =
                            $"User {userId} is not authorized to CREATE prescriptions - User is not a Doctor";
                        Log.Warning("CREATE authorization DENIED for User {UserId} - {Reason}", userId, failureReason);
                    }

                    break; // End Create case

                case nameof(PrescriptionOperations.Read):
                    isAuthorized = (resource!.DoctorPrescription?.DoctorId == userId) ||
                                   (resource.PatientPrescription?.PatientId == userId);

                    if (!isAuthorized)
                    {
                        failureReason =
                            $"User {userId} is neither the prescribing doctor nor the patient for Prescription {resource.Id}";
                        Log.Warning("READ access DENIED for User {UserId} on Prescription {PrescriptionId} - {Reason}", userId, resource.Id, failureReason);
                    }

                    break;

                case nameof(PrescriptionOperations.Update):
                    isAuthorized = false;
                    failureReason =
                        $"Prescriptions cannot be modified after creation (attempted by User {userId} on Prescription {resource!.Id})";
                    Log.Warning("UPDATE operation DENIED for Prescription {PrescriptionId} by User {UserId} - {Reason}", resource!.Id, userId, failureReason);
                    break;

                case nameof(PrescriptionOperations.Delete):
                    isAuthorized = resource!.DoctorPrescription?.DoctorId == userId && context.User.IsInRole("Doctor");

                    if (!isAuthorized)
                    {
                        failureReason = resource.DoctorPrescription?.DoctorId == userId
                            ? $"User {userId} is the prescribing doctor but lacks 'Doctor' role for Prescription {resource.Id}"
                            : $"User {userId} is not the prescribing doctor for Prescription {resource.Id}";

                        Log.Warning("DELETE access DENIED for User {UserId} on Prescription {PrescriptionId} - {Reason}", userId, resource.Id, failureReason);
                    }

                    break;

                default:
                    failureReason = $"Unhandled requirement: {requirement.Name}";
                    Log.Warning("Unhandled requirement: {RequirementName} for Prescription {PrescriptionId} by User {UserId}", requirement.Name, resourceIdForLog, userId);
                    break;
            }

            if (isAuthorized)
            {
                Log.Information("Authorization SUCCEEDED for User {UserId} requirement {RequirementName} on Prescription {PrescriptionId}", userId, requirement.Name, resourceIdForLog);
                context.Succeed(requirement);
            }
            else
            {
                Log.Warning("Authorization final result: FAILED for User {UserId} requirement {RequirementName} on Prescription {PrescriptionId}. Reason: {Reason}", userId, requirement.Name, resourceIdForLog, failureReason);
                context.Fail(new AuthorizationFailureReason(this, failureReason));
            }

            await Task.CompletedTask;
        }
    }
}
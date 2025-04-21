using MainService.Core.Interfaces.Services;
using MainService.Models.Entities;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Serilog;
using Microsoft.EntityFrameworkCore.Storage;

namespace MainService.Infrastructure.Services;

public class AccountsService(
    UserManager<AppUser> userManager,
    SignInManager<AppUser> signInManager,
    IUnitOfWork uow) : IAccountsService
{
    public async Task<bool> DeleteAccountAsync(int userId, string password)
    {
        var user = await userManager.Users
            .Include(u => u.UserRoles)
            .ThenInclude(ur => ur.Role)
            .FirstOrDefaultAsync(u => u.Id == userId);
        if (user == null)
        {
            Log.Warning("DeleteAccountAsync: User {UserId} not found.", userId);
            return false;
        }

        var passwordCheck = await signInManager.CheckPasswordSignInAsync(user, password, false);
        if (!passwordCheck.Succeeded)
        {
            Log.Warning("DeleteAccountAsync: Incorrect password for user {UserId}.", userId);
            return false;
        }

        var userRoles = user.UserRoles.Select(ur => ur.Role.Name ?? string.Empty).ToList();

        await using var transaction = await uow.BeginTransactionAsync();
        Log.Debug("DeleteAccountAsync: Started transaction for user {UserId}.", userId);
        try
        {
            Log.Debug("DeleteAccountAsync: Starting relationship cleanup for user {UserId}.", userId);
            await CleanupUserSpecificNoActionRelationships(userId);

            if (userRoles.Contains("Doctor", StringComparer.OrdinalIgnoreCase))
            {
                await CleanupDoctorSpecificNoActionRelationships(userId);
            }

            if (userRoles.Contains("Patient", StringComparer.OrdinalIgnoreCase))
            {
                await CleanupPatientSpecificNoActionRelationships(userId);
            }

            if (userRoles.Contains("Nurse", StringComparer.OrdinalIgnoreCase))
            {
                await CleanupNurseSpecificNoActionRelationships(userId);
            }


            if (uow.HasChanges())
            {
                Log.Debug("DeleteAccountAsync: Saving cleanup changes for user {UserId}.", userId);
                await uow.Complete();
                Log.Debug("DeleteAccountAsync: Cleanup changes saved for user {UserId}.", userId);
            }
            else
            {
                Log.Debug("DeleteAccountAsync: No cleanup changes to save for user {UserId}.", userId);
            }

            Log.Debug("DeleteAccountAsync: Attempting UserManager.DeleteAsync for user {UserId}.", userId);
            var identityResult = await userManager.DeleteAsync(user);
            if (!identityResult.Succeeded)
            {
                await RollbackAndLogFailure(transaction, $"UserManager.DeleteAsync failed for user {userId}.",
                    identityResult.Errors);
                return false;
            }

            Log.Debug("DeleteAccountAsync: UserManager.DeleteAsync succeeded for user {UserId}.", userId);

            await transaction.CommitAsync();
            Log.Information("DeleteAccountAsync: Successfully deleted user {UserId} and handled related data.",
                userId);
            return true;
        }
        catch (DbUpdateException dbEx)
        {
            await RollbackAndLogFailure(transaction, $"Database update error during deletion for user {userId}.",
                dbEx);
            return false;
        }
        catch (Exception ex)
        {
            await RollbackAndLogFailure(transaction, $"Unexpected error during deletion for user {userId}.", ex);
            return false;
        }
    }

    private async Task CleanupUserSpecificNoActionRelationships(int userId)
    {
        var umrLinks = await uow.UserMedicalRecordRepository.FindByUserIdAsync(userId);
        if (umrLinks.Count != 0)
        {
            Log.Debug("CleanupUserSpecific: Removing {Count} UserMedicalRecord links for user {UserId}",
                umrLinks.Count, userId);
            uow.UserMedicalRecordRepository.RemoveRange(umrLinks);
        }

        var urLinks = await uow.UserReviewRepository.FindByUserIdAsync(userId);
        if (urLinks.Count != 0)
        {
            Log.Debug("CleanupUserSpecific: Removing {Count} UserReview links for user {UserId}", urLinks.Count,
                userId);
            uow.UserReviewRepository.RemoveRange(urLinks);
        }

        var subs = await uow.SubscriptionRepository.FindByUserIdAsync(userId);
        if (subs.Count != 0)
        {
            Log.Debug("CleanupUserSpecific: Removing {Count} UserSubscription records for user {UserId}",
                subs.Count, userId);
            uow.SubscriptionRepository
                .RemoveRange(subs);
        }

        var cancels =
            await uow.SubscriptionCancellationRepository.FindByUserIdAsync(userId);
        if (cancels.Count != 0)
        {
            Log.Debug(
                "CleanupUserSpecific: Removing {Count} direct SubscriptionCancellation records for user {UserId}",
                cancels.Count, userId);
            uow.SubscriptionCancellationRepository.RemoveRange(cancels);
        }
    }

    private async Task CleanupDoctorSpecificNoActionRelationships(int doctorId)
    {
        Log.Debug("CleanupDoctorSpecific: Cleaning relationships for doctor {DoctorId}", doctorId);

        var drLinks = await uow.DoctorReviewRepository.FindByDoctorIdAsync(doctorId);
        if (drLinks.Count != 0)
        {
            Log.Debug("CleanupDoctorSpecific: Removing {Count} DoctorReview links for doctor {DoctorId}",
                drLinks.Count, doctorId);
            uow.DoctorReviewRepository.RemoveRange(drLinks);
        }

        var dpLinks = await uow.DoctorPrescriptionRepository.FindByDoctorIdAsync(doctorId);
        if (dpLinks.Count != 0)
        {
            Log.Debug("CleanupDoctorSpecific: Removing {Count} DoctorPrescription links for doctor {DoctorId}",
                dpLinks.Count, doctorId);
            uow.DoctorPrescriptionRepository.RemoveRange(dpLinks);
        }

        var doLinks = await uow.DoctorOrderRepository.FindByDoctorIdAsync(doctorId);
        if (doLinks.Count != 0)
        {
            Log.Debug("CleanupDoctorSpecific: Removing {Count} DoctorOrder links for doctor {DoctorId}",
                doLinks.Count, doctorId);
            uow.DoctorOrderRepository.RemoveRange(doLinks);
        }

        var deLinks = await uow.DoctorEventRepository.FindByDoctorIdAsync(doctorId);
        if (deLinks.Count != 0)
        {
            Log.Debug("CleanupDoctorSpecific: Removing {Count} DoctorEvent links for doctor {DoctorId}",
                deLinks.Count, doctorId);
            uow.DoctorEventRepository.RemoveRange(deLinks);
        }
    }

    private async Task CleanupPatientSpecificNoActionRelationships(int patientId)
    {
        Log.Debug("CleanupPatientSpecific: Cleaning relationships for patient {PatientId}", patientId);

        var peLinks = await uow.PatientEventRepository.FindByPatientIdAsync(patientId);
        if (peLinks.Count != 0)
        {
            Log.Debug("CleanupPatientSpecific: Removing {Count} PatientEvent links for patient {PatientId}",
                peLinks.Count, patientId);
            uow.PatientEventRepository.RemoveRange(peLinks);
        }

        var ppLinks =
            await uow.PatientPrescriptionRepository.FindByPatientIdAsync(patientId);
        if (ppLinks.Count != 0)
        {
            Log.Debug("CleanupPatientSpecific: Removing {Count} PatientPrescription links for patient {PatientId}",
                ppLinks.Count, patientId);
            uow.PatientPrescriptionRepository.RemoveRange(ppLinks);
        }

        var poLinks = await uow.PatientOrderRepository.FindByPatientIdAsync(patientId);
        if (poLinks.Count != 0)
        {
            Log.Debug("CleanupPatientSpecific: Removing {Count} PatientOrder links for patient {PatientId}",
                poLinks.Count, patientId);
            uow.PatientOrderRepository.RemoveRange(poLinks);
        }
    }

    private async Task CleanupNurseSpecificNoActionRelationships(int nurseId)
    {
        Log.Debug("CleanupNurseSpecific: Cleaning relationships for nurse {NurseId}", nurseId);

        var neLinks = await uow.NurseEventRepository.FindByNurseIdAsync(nurseId);
        if (neLinks.Count != 0)
        {
            Log.Debug("CleanupNurseSpecific: Removing {Count} NurseEvent links for nurse {NurseId}", neLinks.Count,
                nurseId);
            uow.NurseEventRepository.RemoveRange(neLinks);
        }
    }

    private async Task RollbackAndLogFailure(IDbContextTransaction transaction, string message, Exception ex)
    {
        Log.Error(ex, "RollbackAndLogFailure: " + message);
        try
        {
            await transaction.RollbackAsync();
        }
        catch (Exception rollbackEx)
        {
            Log.Fatal(rollbackEx, "FATAL: Failed to rollback transaction after error: " + message);
        }
    }

    private async Task RollbackAndLogFailure(IDbContextTransaction transaction, string message,
        IEnumerable<IdentityError>? errors = null)
    {
        var errorDetails = errors != null
            ? string.Join("; ", errors.Select(e => $"{e.Code}: {e.Description}"))
            : "No details.";
        Log.Error("RollbackAndLogFailure: {Message} Errors: {Errors}", message, errorDetails);
        try
        {
            await transaction.RollbackAsync();
        }
        catch (Exception rollbackEx)
        {
            Log.Fatal(rollbackEx, "FATAL: Failed to rollback transaction after error: " + message);
        }
    }
}
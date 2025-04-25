using MainService.Core.Interfaces.Services;
using MainService.Models.Entities;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Serilog;

namespace MainService.Infrastructure.Services;

public class DoctorNursesService(IUnitOfWork uow, INotificationsService notificationsService, UserManager<AppUser> userManager) : IDoctorNursesService
{
    public async Task<(bool Success, UserNotification? Notification)> DeleteAssociationAsync(int doctorId, int nurseId, int requestingUserId)
    {
        Log.Information("Attempting to delete association between Doctor {DoctorId} and Nurse {NurseId} by User {RequestingUserId}", doctorId, nurseId, requestingUserId);

        var association = await uow.DoctorNurseRepository.FindByCompositeKeyAsync(doctorId, nurseId);
        if (association == null)
        {
            Log.Warning("DeleteAssociationAsync: Association not found for Doctor {DoctorId} and Nurse {NurseId}.", doctorId, nurseId);
            return (true, null); 
        }

        var doctor = await userManager.Users.FirstOrDefaultAsync(u => u.Id == doctorId);
        var nurse = await userManager.Users.FirstOrDefaultAsync(u => u.Id == nurseId);

        if (doctor == null || nurse == null)
        {
            Log.Error("DeleteAssociationAsync: Doctor or Nurse entity not found during deletion for DoctorId {DoctorId}, NurseId {NurseId}.", doctorId, nurseId);
            
            return (false, null);
        }

        UserNotification? createdNotificationRecord = null;

        await using var transaction = await uow.BeginTransactionAsync();
        try
        {
            
            uow.DoctorNurseRepository.Remove(association);
             if (!await uow.Complete()) 
            {
                await transaction.RollbackAsync();
                Log.Error("DeleteAssociationAsync: Failed to delete the DoctorNurse record for Doctor {DoctorId} and Nurse {NurseId}.", doctorId, nurseId);
                return (false, null);
            }
            Log.Information("DeleteAssociationAsync: Successfully deleted DoctorNurse record for Doctor {DoctorId} and Nurse {NurseId}.", doctorId, nurseId);
            
            var notification = await notificationsService.CreateForNurseDissociated(nurse, doctor);
            if (notification != null)
            {
                createdNotificationRecord = await uow.UserNotificationRepository.AddAsync(notification);
                
                if (!await uow.Complete())
                {
                    await transaction.RollbackAsync();
                    Log.Error("DeleteAssociationAsync: Failed to save UserNotification link after dissociation for Nurse {NurseId}.", nurseId);
                    return (false, null); 
                }
                Log.Information("DeleteAssociationAsync: Successfully saved dissociation notification link for Nurse {NurseId}. Notification ID: {NotificationId}", nurseId, createdNotificationRecord.NotificationId);
            }
            else
            {
                Log.Warning("DeleteAssociationAsync: Notification object creation failed for Nurse {NurseId} dissociation.", nurseId);
                
            }
            
            await transaction.CommitAsync();
            Log.Information("DeleteAssociationAsync: Transaction committed for Doctor {DoctorId} and Nurse {NurseId} dissociation.", doctorId, nurseId);

            
            return (true, createdNotificationRecord);
        }
        catch (Exception ex)
        {
            Log.Error(ex, "DeleteAssociationAsync: Exception occurred during dissociation transaction for Doctor {DoctorId} and Nurse {NurseId}.", doctorId, nurseId);
            await transaction.RollbackAsync();
            return (false, null);
        }
    }
}

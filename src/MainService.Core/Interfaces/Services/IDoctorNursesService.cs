using MainService.Models.Entities;

namespace MainService.Core.Interfaces.Services;

public interface IDoctorNursesService
{
    Task<(bool Success, UserNotification? Notification)> DeleteAssociationAsync(int doctorId, int nurseId, int requestingUserId);
}
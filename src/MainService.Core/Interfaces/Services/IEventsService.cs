using MainService.Models.Entities;

namespace MainService.Core.Interfaces.Services;
public interface IEventsService
{
    Task<bool> IsDoctorAvailableAsync(int doctorId, DateTime dateFrom, DateTime dateTo);
    Task<bool> DeleteAsync(Event item);
    Task<bool> CanUserAccessEventAsync(int userId, int eventId);
    Task<bool> CanDoctorAccessEventAsync(int doctorId, int eventId);
    Task<bool> CanModifyEventAsync(int userId, int eventId);
    Task<bool> CanDeleteEventAsync(int userId, int eventId);
    Task<bool> CanPatientAccessEventAsync(int patientId, int eventId);
    Task<bool> CanCancelEventAsync(int userId, int eventId);
}
using MainService.Models.Entities;

namespace MainService.Core.Interfaces.Services;
public interface IEventsService
{
    Task<bool> IsDoctorAvailableAsync(int doctorId, DateTime dateFrom, DateTime dateTo);
    Task<bool> DeleteAsync(Event item);
}
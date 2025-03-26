using MainService.Core.Interfaces.Services;
using MainService.Models.Entities;

namespace MainService.Infrastructure.Services;

public class EventsService(IUnitOfWork uow) : IEventsService
{
    public async Task<bool> DeleteAsync(Event item)
    {
        Event? itemToDelete = await uow.EventRepository.GetByIdAsync(item.Id);

        if (itemToDelete == null) return false;

        uow.EventRepository.Delete(itemToDelete);

        if (!await uow.Complete()) return false;

        return true;
    }

    public async Task<bool> IsDoctorAvailableAsync(int doctorId, DateTime dateFrom, DateTime dateTo)
    {
        await Task.Delay(0);

        // TODO: Implement logic to check if doctor is available in selected time
        return true;
    }

    public async Task<bool> CanUserAccessEventAsync(int userId, int eventId)
    {
        var eventEntity = await uow.EventRepository.GetByIdAsNoTrackingAsync(eventId);
        if (eventEntity == null) return false;

        // Check if user is the doctor for this event
        if (eventEntity.DoctorEvent.DoctorId == userId) return true;

        // Check if user is the patient for this event
        if (eventEntity.PatientEvent.PatientId == userId) return true;

        // Check if user is a nurse for this event
        if (eventEntity.NurseEvents.Any(n => n.NurseId == userId)) return true;

        return false;
    }

    public async Task<bool> CanDoctorAccessEventAsync(int doctorId, int eventId)
    {
        return await uow.EventRepository.DoctorHasEventAsync(doctorId, eventId);
    }

    public async Task<bool> CanPatientAccessEventAsync(int patientId, int eventId)
    {
        var eventEntity = await uow.EventRepository.GetByIdAsNoTrackingAsync(eventId);
        if (eventEntity == null) return false;

        return eventEntity.PatientEvent.PatientId == patientId;
    }

    public async Task<bool> CanModifyEventAsync(int userId, int eventId)
    {
        var eventEntity = await uow.EventRepository.GetByIdAsNoTrackingAsync(eventId);
        if (eventEntity == null) return false;

        // Typically only doctors can modify events
        return eventEntity.DoctorEvent.DoctorId == userId;
    }

    public async Task<bool> CanDeleteEventAsync(int userId, int eventId)
    {
        // Same rules as modification - typically only doctors can delete
        return await CanModifyEventAsync(userId, eventId);
    }
}
using MainService.Models.Entities;
using Microsoft.EntityFrameworkCore;

namespace MainService.Infrastructure.QueryExtensions;

public static class EventQueryExtensions
{
    /// <summary>
    /// Includes related navigation properties for Event.
    /// </summary>
    public static IQueryable<Event> Includes(this IQueryable<Event> query)
    {
        return query
            .Include(x => x.EventService).ThenInclude(x => x.Service)
            .Include(x => x.EventClinic)
            .Include(x => x.DoctorEvent).ThenInclude(x => x.Doctor)
            .Include(x => x.PatientEvent)
            .Include(x => x.PatientEvent.Patient.UserPhoto.Photo)
            .Include(x => x.NurseEvents)
            .Include(x => x.EventPrescriptions).ThenInclude(x => x.Prescription)
            .Include(x => x.EventPaymentMethodType)
            .Include(x => x.EventMedicalInsuranceCompany)
            .Include(x => x.Payments)
            .AsSplitQuery();
    }
}
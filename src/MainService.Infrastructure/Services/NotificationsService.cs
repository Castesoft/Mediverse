using MainService.Core.Interfaces.Services;
using MainService.Models.Entities;

namespace MainService.Infrastructure.Services;

public class NotificationsService : INotificationsService
{
    public Task<UserNotification> CreateForPatientEventConfirmation(Event @event, AppUser patient)
    {
        var notification = new Notification
        {
            Title = "Nueva cita agendada",
            Message =
                $"Tu cita con {GetDoctorTitle(@event.DoctorEvent.Doctor)} ha sido agendada para el día {@event.DateFrom:dd/MM/yyyy} a las {@event.DateTo:HH:mm}",
            ActionUrl = null,
            NotificationType = NotificationType.AppointmentScheduled,
            Payload = null,
        };

        var userNotification = new UserNotification
        {
            AppUserId = patient.Id,
            Notification = notification,
            IsRead = false,
            IsFavorite = false,
            IsImportant = false,
        };

        return Task.FromResult(userNotification);
    }

    public Task<UserNotification> CreateForDoctorEventConfirmation(Event @event, AppUser doctor)
    {
        var patientName = @event.PatientEvent.Patient.FirstName + " " + @event.PatientEvent.Patient.LastName;
        var notification = new Notification
        {
            Title = $"Nueva cita agendada con {patientName}",
            Message =
                $"Un paciente ha agendado una nueva cita para el día {@event.DateFrom:dd/MM/yyyy} a las {@event.DateTo:HH:mm}",
            ActionUrl = null,
            NotificationType = NotificationType.AppointmentScheduled,
            Payload = null,
        };

        var userNotification = new UserNotification
        {
            AppUserId = doctor.Id,
            Notification = notification,
            IsRead = false,
            IsFavorite = false,
            IsImportant = false,
        };

        return Task.FromResult(userNotification);
    }

    private static string GetDoctorTitle(AppUser doctor)
    {
        var doctorSuffix = doctor.Sex == "Femenino" ? "Dra." : "Dr.";
        var doctorArticle = doctorSuffix == "Dra." ? "la" : "el";

        return $"{doctorArticle} {doctorSuffix} {doctor.LastName}";
    }
}
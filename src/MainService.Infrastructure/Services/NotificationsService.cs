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
            Message = $"Tu cita con {GetDoctorTitle(@event.DoctorEvent.Doctor)} ha sido agendada para el día {@event.DateFrom:dd/MM/yyyy} a las {@event.DateTo:HH:mm}",
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
            Message = $"Un paciente ha agendado una nueva cita para el día {@event.DateFrom:dd/MM/yyyy} a las {@event.DateTo:HH:mm}",
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

    public Task<UserNotification?> CreateForPatientEventCancellation(Event @event, AppUser patient)
    {
        if (@event.DateFrom == null || @event.DateTo == null) return Task.FromResult<UserNotification?>(null);

        var notification = new Notification
        {
            Title = "Cita cancelada",
            Message = $"Tu cita con {GetDoctorTitle(@event.DoctorEvent.Doctor)} del día {@event.DateFrom:dd/MM/yyyy} a las {@event.DateTo:HH:mm} ha sido cancelada.",
            ActionUrl = null,
            NotificationType = NotificationType.AppointmentCancelled,
            Payload = null,
        };

        var userNotification = new UserNotification
        {
            AppUserId = patient.Id,
            Notification = notification,
            IsRead = false,
            IsFavorite = false,
            IsImportant = true,
        };

        return Task.FromResult<UserNotification?>(userNotification);
    }

    public Task<UserNotification?> CreateForDoctorEventCancellation(Event @event, AppUser doctor)
    {
         if (@event.DateFrom == null || @event.DateTo == null) return Task.FromResult<UserNotification?>(null);

        var patientName = @event.PatientEvent.Patient.FirstName + " " + @event.PatientEvent.Patient.LastName;
        var notification = new Notification
        {
            Title = $"Cita cancelada con {patientName}",
            Message = $"La cita con {patientName} del día {@event.DateFrom:dd/MM/yyyy} a las {@event.DateTo:HH:mm} ha sido cancelada.",
            ActionUrl = null,
            NotificationType = NotificationType.AppointmentCancelled,
            Payload = null,
        };

        var userNotification = new UserNotification
        {
            AppUserId = doctor.Id,
            Notification = notification,
            IsRead = false,
            IsFavorite = false,
            IsImportant = true,
        };

        return Task.FromResult<UserNotification?>(userNotification);
    }

    public Task<UserNotification?> CreateForNurseAssociated(AppUser associatedNurse, AppUser associatingDoctor)
    {
        var doctorName = $"{associatingDoctor.FirstName} {associatingDoctor.LastName}".Trim();
        var notification = new Notification
        {
            Title = "Te han agregado a un equipo",
            Message = $"El Dr./La Dra. {doctorName} te ha asociado como Especialista en DocHub.",
            NotificationType = NotificationType.NurseAssociated,
        };

        var userNotification = new UserNotification
        {
            AppUserId = associatedNurse.Id,
            Notification = notification,
        };
        return Task.FromResult<UserNotification?>(userNotification);
    }

    public Task<UserNotification?> CreateForDoctorInvitationSent(AppUser invitingDoctor, string inviteeEmail,
        string roleInvitedAs = "Especialista")
    {
        if (string.IsNullOrEmpty(inviteeEmail)) return Task.FromResult<UserNotification?>(null);

        var notification = new Notification
        {
            Title = "Invitación enviada",
            Message = $"Se envió una invitación a {inviteeEmail} para unirse como {roleInvitedAs}.",
            NotificationType = NotificationType.NurseInvitationSent, 
        };

        var userNotification = new UserNotification
        {
            AppUserId = invitingDoctor.Id, 
            Notification = notification,
        };
        return Task.FromResult<UserNotification?>(userNotification);
    }

    public Task<UserNotification?> CreateForDoctorInvitationAccepted(AppUser invitingDoctor, AppUser acceptedNurse)
    {
        var nurseName = $"{acceptedNurse.FirstName} {acceptedNurse.LastName}".Trim();
        var notification = new Notification
        {
            Title = "Invitación Aceptada",
            Message = $"{nurseName} ({acceptedNurse.Email}) ha aceptado tu invitación y ahora forma parte de tu equipo como Especialista.",
            NotificationType = NotificationType.NurseInvitationAccepted,
        };

        var userNotification = new UserNotification
        {
            AppUserId = invitingDoctor.Id, 
            Notification = notification,
        };
        return Task.FromResult<UserNotification?>(userNotification);
    }

    public Task<UserNotification?> CreateForNurseDissociated(AppUser dissociatedNurse, AppUser dissociatingDoctor)
    {
        var doctorName = $"{dissociatingDoctor.FirstName} {dissociatingDoctor.LastName}".Trim();
        var notification = new Notification
        {
            Title = "Has sido desvinculado/a",
            Message = $"El Dr./La Dra. {doctorName} te ha desvinculado de su equipo en DocHub.",
            NotificationType = NotificationType.NurseDissociated,
        };

        var userNotification = new UserNotification
        {
            AppUserId = dissociatedNurse.Id, 
            Notification = notification,
            IsImportant = true, 
        };
        return Task.FromResult<UserNotification?>(userNotification);
    }
}
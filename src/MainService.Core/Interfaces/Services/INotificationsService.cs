using MainService.Models.Entities;

namespace MainService.Core.Interfaces.Services;

public interface INotificationsService
{
    Task<UserNotification> CreateForPatientEventConfirmation(Event @event, AppUser patient);
    Task<UserNotification> CreateForDoctorEventConfirmation(Event @event, AppUser doctor);
    Task<UserNotification?> CreateForPatientEventCancellation(Event @event, AppUser patient); 
    Task<UserNotification?> CreateForDoctorEventCancellation(Event @event, AppUser doctor);
    Task<UserNotification?> CreateForNurseAssociated(AppUser associatedNurse, AppUser associatingDoctor);
    Task<UserNotification?> CreateForDoctorInvitationSent(AppUser invitingDoctor, string inviteeEmail, string roleInvitedAs = "Especialista");
    Task<UserNotification?> CreateForDoctorInvitationAccepted(AppUser invitingDoctor, AppUser acceptedNurse);
    Task<UserNotification?> CreateForNurseDissociated(AppUser dissociatedNurse, AppUser dissociatingDoctor);
}
using MainService.Models.Entities;

namespace MainService.Core.Interfaces.Services;

public interface IEmailService
{
    Task SendMail(string to, string subject, string htmlMessage);
    string CreateResetPasswordEmail(AppUser user, string resetUrl);
    string CreateVerifyEmailAddressEmailForRegister(AppUser user, string verificationCode);
    string CreateSubscriptionConfirmationEmail(AppUser user, decimal amount, DateTime subscriptionDate);
    string CreateSubscriptionCancellationEmail(AppUser user, DateTime cancellationDate, string? feedback = null);

    string CreateVerifyEmailAddressEmailForUpdate(AppUser user, string verificationCode);

    string CreateAppointmentConfirmationEmail(string doctorName, string appointmentDate, string appointmentTime,
        string service, int eventId);
    string CreateAppointmentCancellationEmail(string doctorName, string appointmentDate, string appointmentTime,
        string service);
    string CreateSatisfactionSurveyEmail(AppUser doctor, AppUser patient, Event @event);
    string CreateEventReceiptEmail(
        string patientName,
        string doctorName,
        DateTime eventDate,
        string serviceName,
        decimal amountPaid,
        string paymentMethodName,
        DateTime paymentDate,
        string? referenceNumber,
        string? notes,
        int eventId,
        string clinicName 
    );
}
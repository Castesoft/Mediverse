using MainService.Models.Entities;

namespace MainService.Core.Interfaces.Services;
public interface IEmailService
{
    Task SendMail(string to, string subject, string htmlMessage);
    string CreateResetPasswordEmail(AppUser user, string resetUrl);
    string CreateVerifyEmailAddressEmailForRegister(AppUser user, string verificationUrl, string verificationCode);
    string CreateVerifyEmailAddressEmailForUpdate(AppUser user, string verificationCode);
    string CreateAppointmentConfirmationEmail(string doctorName, string appointmentDate, string appointmentTime, string service);
}
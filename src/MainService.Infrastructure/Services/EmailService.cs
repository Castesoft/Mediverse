using System.Net;
using System.Net.Mail;
using MainService.Core.Interfaces.Services;
using MainService.Core.Settings;
using MainService.Models.Entities;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;

namespace MainService.Infrastructure.Services;

public class EmailService(IOptions<EmailSettings> emailSettings, ILogger<EmailService> logger) : IEmailService
{
    private readonly EmailSettings _emailSettings =
        emailSettings.Value ?? throw new ArgumentNullException(nameof(emailSettings));

    public async Task SendMail(string to, string subject, string htmlMessage)
    {
        try
        {
            using var message = new MailMessage();
            message.From = new MailAddress(_emailSettings.FromAddress);
            message.Subject = subject;
            message.Body = htmlMessage;
            message.IsBodyHtml = true;
            message.To.Add(to);

            using var client = new SmtpClient(_emailSettings.SmtpHost, _emailSettings.SmtpPort);
            client.Credentials = new NetworkCredential(_emailSettings.SmtpUser, _emailSettings.SmtpPass);
            client.EnableSsl = true;

            await client.SendMailAsync(message);
        }
        catch (SmtpException ex)
        {
            logger.LogError(ex, "SMTP error sending email to {Email}", to);
            throw;
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Unexpected error sending email to {Email}", to);
            throw;
        }
    }

    private static string GetEmailHeader() =>
        """
        <html>
        <body>
          <div style="font-family:Arial,Helvetica,sans-serif; line-height: 1.5; font-weight: normal; font-size: 15px; color: #2F3044; min-height: 100%; margin:0; padding:0; width:100%; background-color:#edf2f7">
            <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="border-collapse:collapse; margin:0 auto; padding:0; max-width:600px">
        """;

    private static string GetEmailFooter() =>
        """
             <tr>
               <td align="center" valign="center" style="font-size: 13px; text-align:center; padding: 20px; color: #6d6e7c;">
                 <p>Dirección de DocHub, MX.</p>
                 <p>Copyright &copy; 
                 <a href="https://dochub.mx" rel="noopener" target="_blank">DocHub</a>.</p>
               </td>
             </tr>
            </table>
          </div>
        </body>
        </html>
        """;

    public string CreateAppointmentConfirmationEmail(string doctorName, string appointmentDate, string appointmentTime,
        string service)
    {
        return $"""
                {GetEmailHeader()}
                <tr>
                  <td align="center" valign="center" style="text-align:center; padding: 40px">
                    <a href="https://dochub.mx" rel="noopener" target="_blank">
                      <img alt="Logo" src="https://dochub.mx/media/logos/text/logo-text-default.svg" />
                    </a>
                  </td>
                </tr>
                <tr>
                  <td align="left" valign="center">
                    <div style="text-align:left; margin: 0 20px; padding: 40px; background-color:#ffffff; border-radius: 6px">
                      <div style="padding-bottom: 30px; font-size: 17px;">
                        <strong>¡Tu cita ha sido agendada!</strong>
                      </div>
                      <div style="padding-bottom: 20px">Estos son los detalles de tu cita.</div>
                      <div style="padding-bottom: 20px">Expecialista: {doctorName}</div>
                      <div style="padding-bottom: 20px">Día: {appointmentDate}</div>
                      <div style="padding-bottom: 20px">Hora: {appointmentTime}</div>
                      <div style="padding-bottom: 40px">Servicio: {service}</div>
                      <div style="padding-bottom: 10px">Si alguna de esta información es incorrecta, por favor contacta a tu especialista.</div>
                    </div>
                  </td>
                </tr>
                {GetEmailFooter()}
                """;
    }

    public string CreateSubscriptionConfirmationEmail(AppUser user, decimal amount, DateTime subscriptionDate)
    {
        return $"""
                {GetEmailHeader()}
                <tr>
                  <td align="center" valign="center" style="text-align:center; padding: 40px">
                    <a href="https://dochub.mx" rel="noopener" target="_blank">
                      <img alt="DocHub Logo" src="assets/media/logos/mail.svg" />
                    </a>
                  </td>
                </tr>
                <tr>
                  <td align="left" valign="center">
                    <div style="text-align:left; margin: 0 20px; padding: 40px; background-color:#ffffff; border-radius: 6px">
                      <div style="padding-bottom: 30px; font-size: 17px;">
                        <strong>¡Hola {user.FirstName}!</strong>
                      </div>
                      <div style="padding-bottom: 20px">
                        <strong>Tu suscripción a DocHub Pro ha sido confirmada</strong> y el pago se ha procesado correctamente.
                      </div>
                      <div style="padding-bottom: 20px">
                        <strong>Fecha de suscripción:</strong> {subscriptionDate:MMMM dd, yyyy}
                      </div>
                      <div style="padding-bottom: 20px">
                        <strong>Monto pagado:</strong> ${amount:F2}
                      </div>
                      <div style="padding-bottom: 20px">
                        Gracias por tu confianza. Disfruta de todas las ventajas que DocHub Pro te ofrece.
                      </div>
                      <div style="padding-bottom: 20px">
                        Si tienes alguna duda o requieres asistencia, no dudes en contactarnos.
                      </div>
                    </div>
                  </td>
                </tr>
                {GetEmailFooter()}
                """;
    }

    public string CreateSubscriptionCancellationEmail(AppUser user, DateTime cancellationDate, string? feedback = null)
    {
        return $"""
                {GetEmailHeader()}
                <tr>
                  <td align="center" valign="center" style="text-align:center; padding: 40px">
                    <a href="https://dochub.mx" rel="noopener" target="_blank">
                      <img alt="DocHub Logo" src="assets/media/logos/mail.svg" />
                    </a>
                  </td>
                </tr>
                <tr>
                  <td align="left" valign="center">
                    <div style="text-align:left; margin: 0 20px; padding: 40px; background-color:#ffffff; border-radius: 6px">
                      <div style="padding-bottom: 30px; font-size: 17px;">
                        <strong>¡Hola {user.FirstName}!</strong>
                      </div>
                      <div style="padding-bottom: 20px">
                        Tu suscripción a DocHub Pro ha sido cancelada.
                      </div>
                      <div style="padding-bottom: 20px">
                        <strong>Fecha de cancelación:</strong> {cancellationDate:MMMM dd, yyyy}
                      </div>
                      {(string.IsNullOrEmpty(feedback) ? "" : $"<div style=\"padding-bottom: 20px\"><strong>Tu feedback:</strong> {feedback}</div>")}
                      <div style="padding-bottom: 20px">
                        Lamentamos verte partir. Si tienes preguntas o necesitas asistencia, no dudes en contactarnos.
                      </div>
                    </div>
                  </td>
                </tr>
                {GetEmailFooter()}
                """;
    }


    public string CreateResetPasswordEmail(AppUser user, string resetUrl)
    {
        return $"""
                <html>
                    <body>
                        <div style='padding: 2rem; background-color: #e9ecef;'>
                            <div style='width: 100%; max-width: 600px; margin: auto;'>
                                <div style='background-color: white; padding: 1.5rem; border-radius: 40px; box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15); text-align: center;'>
                                    <p style='color: #888; font-size: 22px; margin-bottom:40px;'>
                                        ¡Hola {user.FirstName}! 👋
                                    </p>
                                    <p style='color: #888; font-size: 22px; margin-bottom:40px;'>
                                        ¡No te preocupes! 🌟 Si necesitas restablecer tu contraseña, simplemente haz clic en el enlace de abajo 🖱️ y elige una nueva:
                                    </p>
                                    <a href='{resetUrl}' target='_blank' style='display: inline-block; font-weight: bold; text-transform: uppercase; color: #fff; background-color: #479eb1; padding: 0.375rem 0.75rem; font-size: 1.25rem; line-height: 1.5; border-radius: 0.3rem; text-decoration: none; margin-bottom: 40px;'>
                                        Enlace de recuperación de contraseña 🔗
                                    </a>
                                    <p style='color: #888; font-size: 22px; margin-bottom:40px;'>
                                        Si no solicitaste una nueva contraseña, por favor ignora este correo. 🚫 Para cualquier duda o asistencia adicional, estamos aquí para ayudarte. 🤝
                                    </p>
                                </div>
                            </div>
                        </div>
                    </body>
                </html>
                """;
    }

    public string CreateSatisfactionSurveyEmail(AppUser doctor, AppUser patient, Event @event)
    {
        return $"""
                {GetEmailHeader()}
                <tr>
                  <td align="center" valign="center" style="text-align:center; padding: 40px">
                    <a href="https://dochub.mx" rel="noopener" target="_blank">
                      <img alt="Logo" src="https://dochub.mx/media/logos/text/logo-text-default.svg" />
                    </a>
                  </td>
                </tr>
                <tr>
                  <td align="left" valign="center">
                    <div style="text-align:left; margin: 0 20px; padding: 40px; background-color:#ffffff; border-radius: 6px">
                      <div style="padding-bottom: 30px; font-size: 17px;">
                        <strong>¡Cuéntanos sobre tu experiencia!</strong>
                      </div>
                      <div style="padding-bottom: 20px">Expecialista: {doctor.FirstName} {doctor.LastName}</div>
                      <div style="padding-bottom: 20px">Fecha: {@event.DateFrom!.Value.ToLocalTime()}</div>
                      <div style="padding-bottom: 40px">Servicio: {@event.EventService.Service.Name}</div>
                      <a href="https://localhost:4400/account" rel="noopener" target="_blank">Clic aquí para completar la encuesta</a>.
                      <div style="padding-bottom: 10px">Si alguna de esta información es incorrecta, por favor contacta a tu especialista.</div>
                    </div>
                  </td>
                </tr>
                {GetEmailFooter()}
                """;
    }

    public string CreateVerifyEmailAddressEmailForRegister(AppUser user, string verificationUrl,
        string verificationCode)
    {
        return $"""
                <html>
                    <body>
                        <section class="border border-0 border-bottom" style="padding-top: 30px; padding-bottom: 60px;">
                          <div class="container-fluid container-lg" style="max-width: 1320px;">
                            <div class="row d-flex align-items-center">
                              <div class="col" style="width: 50%;">
                                <h1 class="display-4 fw-bold mb-4 lh-1">
                                  Gracias por crear una cuenta con MS2FASample de Castesoft
                                </h1>
                                <p class="mb-4">
                                  ¡Hola {user.FirstName} {user.LastName}, nos alegra verte con nosotros!
                                </p>
                                <a href="{verificationUrl}" class="btn btn-dark btn-lg">
                                  Verificar correo
                                </a>
                              </div>
                              <div class="col px-5 d-flex justify-content-center" style="width: 50%;">
                                <div class="img-fluid bg-secondary-subtle" style="min-height: 300px; max-width: 300px; width: 300px; height: 300px;"></div>
                              </div>
                            </div>
                          </div>
                        </section>
                        <section class="py-5">
                          <div class="container-fluid container-lg" style="max-width: 1320px;">
                            <div class="row d-flex align-items-center">
                              <div class="col" style="width: 50%;">
                                <h1 class="display-5 fw-bold mb-4">
                                  Verifica tu Correo
                                </h1>
                                <p>
                                  Para concluir la creación de tu cuenta, por favor verifica tu correo electrónico usando el código a continuación.
                                </p>
                              </div>
                              <div class="col" style="width: 50%;">
                                <div class="border rounded p-3 d-flex">
                                  <div class="img-fluid bg-secondary-subtle" style="max-width: 25%; width: 25%; height: 130px;"></div>
                                  <div class="px-3">
                                    <h3 class="fw-bold fs-3 mb-4">
                                      Código de verificación
                                    </h3>
                                    <code class="font-monospace fs-2 fw-light p-3 bg-body-tertiary rounded-4">{verificationCode}</code>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </section>
                        <section class="py-5 border border-0 border-top">
                          <div class="container-fluid">
                            <p class="fs-4 fw-light text-center">
                              Si no creaste esta cuenta, favor de ignorar este correo.
                            </p>
                          </div>
                        </section>
                    </body>
                </html>
                """;
    }

    public string CreateVerifyEmailAddressEmailForUpdate(AppUser user, string verificationCode)
    {
        return $"""
                <html>
                    <body>
                        <h1>¡Hola {user.FirstName}!</h1>
                        <p>¡Gracias por actualizar tu correo electrónico! 🌟</p>
                        <p>Para concluir la actualización, por favor verifica tu correo electrónico usando el código a continuación:</p>
                        <code>{verificationCode}</code>
                        <p>Si no solicitaste esta actualización, por favor ignora este correo. 🚫</p>
                    </body>
                </html>
                """;
    }
}
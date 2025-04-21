using System.Globalization;
using System.Net;
using System.Net.Mail;
using System.Text;
using MainService.Core.Interfaces.Services;
using MainService.Core.Settings;
using MainService.Models.Entities;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using Serilog;

namespace MainService.Infrastructure.Services;

public class EmailService(
    IOptions<EmailSettings> emailSettings,
    ILogger<EmailService> logger,
    IConfiguration configuration) : IEmailService
{
    private readonly EmailSettings _emailSettings =
        emailSettings.Value ?? throw new ArgumentNullException(nameof(emailSettings));

    private readonly IConfiguration _configuration =
        configuration ?? throw new ArgumentNullException(nameof(configuration));

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
        <head>
          <style>
            @media screen and (max-width: 600px) {
              .content-div { margin: 0 10px !important; padding: 20px !important; }
              .logo-img { max-width: 200px !important; }
              .cta-button { padding: 10px 20px !important; font-size: 14px !important; }
            }
          </style>
        </head>
        <body>
          <div style="font-family:Arial,Helvetica,sans-serif; line-height: 1.5; font-weight: normal; font-size: 15px; color: #2F3044; min-height: 100%; margin:0; padding:0; width:100%; background-color:#edf2f7">
            <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="border-collapse:collapse; margin:0 auto; padding:0; max-width:600px">
            <tbody>
            <tr>
              <td align="center" valign="center" style="text-align:center; padding: 40px">
                <a href="https://dochub.mx" rel="noopener" target="_blank">
                  <img alt="Logo" src="https://dochub.mx/media/logos/text/logo-text-blue.png" style="max-width: 250px;" class="logo-img" />
                </a>
              </td>
            </tr>
        """;

    private static string GetEmailFooter() =>
        """
             <tr>
               <td align="center" valign="center" style="font-size: 13px; text-align:center; padding: 20px; color: #6d6e7c;">
                 <p style="margin-bottom: 5px;">Dirección de DocHub, MX.</p>
                 <p style="margin-top: 0;">Copyright ©
                 <a href="https://dochub.mx" rel="noopener" target="_blank" style="color: #284092; text-decoration: none;">DocHub</a>.</p>
               </td>
             </tr>
            </tbody>
            </table>
          </div>
        </body>
        </html>
        """;

    public string CreateAppointmentConfirmationEmail(string doctorName, string appointmentDate, string appointmentTime,
        string service, int eventId)
    {
        var frontendBaseUrl = _configuration["ClientSettings:Url"] ?? "https://dochub.mx";

        return $"""
                {GetEmailHeader()}
                <tr>
                  <td align="left" valign="center">
                    <div class="content-div" style="text-align:left; margin: 0 20px; padding: 40px; background-color:#ffffff; border-radius: 6px">
                      <div style="padding-bottom: 30px; font-size: 17px;">
                        <strong>¡Tu cita ha sido agendada!</strong>
                      </div>
                      <div style="padding-bottom: 20px; color: #5E6278;">Estos son los detalles de tu cita.</div>
                      <div style="padding-bottom: 10px; color: #5E6278;"><strong>Expecialista:</strong> {WebUtility.HtmlEncode(doctorName)}</div>
                      <div style="padding-bottom: 10px; color: #5E6278;"><strong>Día:</strong> {WebUtility.HtmlEncode(appointmentDate)}</div>
                      <div style="padding-bottom: 10px; color: #5E6278;"><strong>Hora:</strong> {WebUtility.HtmlEncode(appointmentTime)}</div>
                      <div style="padding-bottom: 30px; color: #5E6278;"><strong>Servicio:</strong> {WebUtility.HtmlEncode(service)}</div>
                
                      <div style="text-align: center; padding-top: 10px; padding-bottom: 30px;">
                        <a href="{frontendBaseUrl}/cuenta/citas/{eventId}" target="_blank" class="cta-button" rel="noopener" style="display: inline-block; text-decoration: none; background-color: #284092; color: #ffffff; padding: 12px 25px; font-size: 16px; font-weight: bold; border-radius: 6px;">
                          Ver Detalles / Confirmar Asistencia
                        </a>
                      </div>
                
                      <div style="border-bottom: 1px solid #eeeeee; margin: 20px 0;"></div>
                      <div style="padding-top: 10px; font-size: 13px; color: #6d6e7c;">
                        Si alguna de esta información es incorrecta, por favor contacta a tu especialista.
                      </div>
                    </div>
                  </td>
                </tr>
                {GetEmailFooter()}
                """;
    }

    public string CreateAppointmentCancellationEmail(string doctorName, string appointmentDate, string appointmentTime,
        string service)
    {
        return $"""
                {GetEmailHeader()}
                <tr>
                  <td align="left" valign="center">
                    <div class="content-div" style="text-align:left; margin: 0 20px; padding: 40px; background-color:#ffffff; border-radius: 6px">
                      <div style="padding-bottom: 30px; font-size: 17px;">
                        <strong>Tu cita ha sido cancelada.</strong>
                      </div>
                      <div style="padding-bottom: 20px; color: #5E6278;">Estos son los detalles de la cita cancelada:</div>
                      <div style="padding-bottom: 10px; color: #5E6278;"><strong>Expecialista:</strong> {WebUtility.HtmlEncode(doctorName)}</div>
                      <div style="padding-bottom: 10px; color: #5E6278;"><strong>Día:</strong> {WebUtility.HtmlEncode(appointmentDate)}</div>
                      <div style="padding-bottom: 10px; color: #5E6278;"><strong>Hora:</strong> {WebUtility.HtmlEncode(appointmentTime)}</div>
                      <div style="padding-bottom: 30px; color: #5E6278;"><strong>Servicio:</strong> {WebUtility.HtmlEncode(service)}</div>
                
                      <div style="border-bottom: 1px solid #eeeeee; margin: 20px 0;"></div>
                      <div style="padding-top: 10px; font-size: 13px; color: #6d6e7c;">
                        Si tienes alguna pregunta o necesitas reagendar, por favor contacta a tu especialista o visita nuestro sitio para buscar una nueva cita.
                      </div>
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
                  <td align="left" valign="center">
                    <div class="content-div" style="text-align:left; margin: 0 20px; padding: 40px; background-color:#ffffff; border-radius: 6px">
                      <div style="padding-bottom: 20px; font-size: 17px;">
                        <strong>¡Hola {WebUtility.HtmlEncode(user.FirstName)}!</strong>
                      </div>
                      <div style="padding-bottom: 20px; color: #5E6278;">
                        <strong>Tu suscripción a DocHub Pro ha sido confirmada</strong> y el pago se ha procesado correctamente.
                      </div>
                      <div style="padding-bottom: 10px; color: #5E6278;">
                        <strong>Fecha de suscripción:</strong> {subscriptionDate:MMMM dd, yyyy}
                      </div>
                      <div style="padding-bottom: 30px; color: #5E6278;">
                        <strong>Monto pagado:</strong> ${amount:F2} MXN
                      </div>
                      <div style="padding-bottom: 10px; color: #5E6278;">
                        Gracias por tu confianza. Disfruta de todas las ventajas que DocHub Pro te ofrece.
                      </div>
                
                      <div style="border-bottom: 1px solid #eeeeee; margin: 20px 0;"></div>
                      <div style="padding-top: 10px; font-size: 13px; color: #6d6e7c;">
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
                  <td align="left" valign="center">
                    <div class="content-div" style="text-align:left; margin: 0 20px; padding: 40px; background-color:#ffffff; border-radius: 6px">
                      <div style="padding-bottom: 20px; font-size: 17px;">
                        <strong>¡Hola {WebUtility.HtmlEncode(user.FirstName)}!</strong>
                      </div>
                      <div style="padding-bottom: 20px; color: #5E6278;">
                        Confirmamos que tu suscripción a DocHub Pro ha sido cancelada.
                      </div>
                      <div style="padding-bottom: 20px; color: #5E6278;">
                        <strong>Fecha de cancelación efectiva:</strong> {cancellationDate:MMMM dd, yyyy}
                      </div>
                      {(string.IsNullOrEmpty(feedback) ? "" : $"<div style=\"padding-bottom: 30px; color: #5E6278;\"><strong>Tu feedback:</strong> {WebUtility.HtmlEncode(feedback)}</div>")}
                      <div style="padding-bottom: 10px; color: #5E6278;">
                        Lamentamos verte partir y agradecemos el tiempo que estuviste con nosotros. Esperamos verte de regreso pronto.
                      </div>
                      <div style="border-bottom: 1px solid #eeeeee; margin: 20px 0;"></div>
                      <div style="padding-top: 10px; font-size: 13px; color: #6d6e7c;">
                        Si tienes preguntas o necesitas asistencia, no dudes en contactarnos.
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
                {GetEmailHeader()}
                <tr>
                  <td align="left" valign="center">
                    <div class="content-div" style="text-align:left; margin: 0 20px; padding: 40px; background-color:#ffffff; border-radius: 6px">
                      <div style="padding-bottom: 20px; font-size: 17px;">
                        <strong>Restablecer tu contraseña</strong>
                      </div>
                      <div style="padding-bottom: 20px; color: #5E6278;">Hola {WebUtility.HtmlEncode(user.FirstName)},</div>
                      <div style="padding-bottom: 30px; color: #5E6278;">
                        Recibimos una solicitud para restablecer la contraseña de tu cuenta DocHub. Haz clic en el botón de abajo para elegir una nueva contraseña.
                      </div>
                
                      <div style="text-align: center; padding-bottom: 30px;">
                        <a href="{resetUrl}" target="_blank" class="cta-button" rel="noopener" style="display: inline-block; text-decoration: none; background-color: #284092; color: #ffffff; padding: 12px 25px; font-size: 16px; font-weight: bold; border-radius: 6px;">
                          Restablecer Contraseña
                        </a>
                      </div>
                
                      <div style="padding-bottom: 20px; text-align: center; font-size: 13px; color: #6d6e7c;">
                         Si tienes problemas con el botón, copia y pega la siguiente URL en tu navegador:<br/> <a href="{resetUrl}" rel="noopener" target="_blank" style="color:#284092">{resetUrl}</a>
                      </div>
                
                      <div style="border-bottom: 1px solid #eeeeee; margin: 20px 0;"></div>
                      <div style="padding-top: 10px; font-size: 13px; color: #6d6e7c;">
                        Si no solicitaste un restablecimiento de contraseña, puedes ignorar este correo electrónico de forma segura.
                      </div>
                    </div>
                  </td>
                </tr>
                {GetEmailFooter()}
                """;
    }

    public string CreateSatisfactionSurveyEmail(AppUser doctor, AppUser patient, Event @event)
    {
        var surveyBaseUrl = _configuration["ClientSettings:SurveyUrl"] ?? "https://dochub.mx/encuesta";
        var surveyUrl = $"{surveyBaseUrl}?eventId={@event.Id}";

        return $"""
                {GetEmailHeader()}
                <tr>
                  <td align="left" valign="center">
                    <div class="content-div" style="text-align:left; margin: 0 20px; padding: 40px; background-color:#ffffff; border-radius: 6px">
                      <div style="padding-bottom: 20px; font-size: 17px;">
                        <strong>¡Cuéntanos sobre tu experiencia!</strong>
                      </div>
                      <div style="padding-bottom: 20px; color: #5E6278;">
                        Hola {WebUtility.HtmlEncode(patient.FirstName)}, valoramos tu opinión y nos gustaría saber cómo fue tu reciente cita en DocHub.
                      </div>
                      <div style="padding-bottom: 10px; color: #5E6278;"><strong>Expecialista:</strong> {WebUtility.HtmlEncode(doctor.FirstName)} {WebUtility.HtmlEncode(doctor.LastName)}</div>
                      <div style="padding-bottom: 10px; color: #5E6278;"><strong>Fecha:</strong> {@event.DateFrom!.Value.ToLocalTime():dd/MM/yyyy HH:mm}</div>
                      <div style="padding-bottom: 30px; color: #5E6278;"><strong>Servicio:</strong> {WebUtility.HtmlEncode(@event.EventService.Service.Name)}</div>
                
                      <div style="text-align: center; padding-bottom: 30px;">
                        <a href="{surveyUrl}" target="_blank" class="cta-button" rel="noopener" style="display: inline-block; text-decoration: none; background-color: #284092; color: #ffffff; padding: 12px 25px; font-size: 16px; font-weight: bold; border-radius: 6px;">
                          Completar Encuesta de Satisfacción
                        </a>
                      </div>
                
                      <div style="border-bottom: 1px solid #eeeeee; margin: 20px 0;"></div>
                      <div style="padding-top: 10px; font-size: 13px; color: #6d6e7c;">
                        Tu feedback nos ayuda a mejorar nuestros servicios. Si tienes alguna pregunta, por favor contacta a tu especialista.
                      </div>
                    </div>
                  </td>
                </tr>
                {GetEmailFooter()}
                """;
    }

    public string CreateVerifyEmailAddressEmailForRegister(AppUser user, string verificationCode)
    {
        return $"""
                {GetEmailHeader()}
                <tr>
                  <td align="left" valign="center">
                    <div class="content-div" style="text-align:left; margin: 0 20px; padding: 40px; background-color:#ffffff; border-radius: 6px">
                      <div style="padding-bottom: 20px; font-size: 17px;">
                        <strong>¡Hola {WebUtility.HtmlEncode(user.FirstName)}! Bienvenido a DocHub.</strong>
                      </div>
                <div style="padding-bottom: 20px; color: #5E6278;">
                  Gracias por registrarte. Para completar tu registro y activar tu cuenta, por favor usa el siguiente código de verificación en la página o aplicación:
                </div>

                <div style="text-align: center; padding: 15px; background-color: #f0f1f7; border-radius: 6px; margin-bottom: 30px;">
                  <div style="font-family: monospace, monospace; font-size: 24px; font-weight: bold; color: #284092; letter-spacing: 5px;">
                    {verificationCode}
                  </div>
                </div>

                <div style="padding-bottom: 10px; color: #5E6278;">
                   Este código es necesario para asegurar que la dirección te pertenece.
                </div>
                      </div>
                
                      <div style="border-bottom: 1px solid #eeeeee; margin: 20px 0;"></div>
                      <div style="padding-top: 10px; font-size: 13px; color: #6d6e7c;">
                        Si no creaste una cuenta en DocHub, puedes ignorar este correo electrónico de forma segura. Tu cuenta no será activada.
                      </div>
                    </div>
                  </td>
                </tr>
                {GetEmailFooter()}
                """;
    }

    public string CreateVerifyEmailAddressEmailForUpdate(AppUser user, string verificationCode)
    {
        return $"""
                {GetEmailHeader()}
                <tr>
                  <td align="left" valign="center">
                    <div class="content-div" style="text-align:left; margin: 0 20px; padding: 40px; background-color:#ffffff; border-radius: 6px">
                      <div style="padding-bottom: 20px; font-size: 17px;">
                        <strong>Verifica tu nueva dirección de correo</strong>
                      </div>
                      <div style="padding-bottom: 20px; color: #5E6278;">
                        ¡Hola {WebUtility.HtmlEncode(user.FirstName)}!
                      </div>
                      <div style="padding-bottom: 20px; color: #5E6278;">
                        Para completar la actualización de tu correo electrónico en DocHub, por favor usa el siguiente código de verificación en la página o aplicación:
                      </div>
                
                      <div style="text-align: center; padding: 15px; background-color: #f0f1f7; border-radius: 6px; margin-bottom: 30px;">
                        <div style="font-family: monospace, monospace; font-size: 24px; font-weight: bold; color: #284092; letter-spacing: 5px;">
                          {verificationCode}
                        </div>
                      </div>
                
                      <div style="padding-bottom: 10px; color: #5E6278;">
                         Este código es necesario para asegurar que la nueva dirección te pertenece.
                      </div>
                
                      <div style="border-bottom: 1px solid #eeeeee; margin: 20px 0;"></div>
                      <div style="padding-top: 10px; font-size: 13px; color: #6d6e7c;">
                        Si no solicitaste esta actualización, por favor ignora este correo o contacta a soporte si tienes preocupaciones.
                      </div>
                    </div>
                  </td>
                </tr>
                {GetEmailFooter()}
                """;
    }

    public string CreateEventReceiptEmail(
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
        string clinicName)
    {
        var culture = new CultureInfo("es-MX");

        return $"""
                {GetEmailHeader()}
                <tr>
                  <td align="left" valign="center">
                    <div class="content-div" style="text-align:left; margin: 0 20px; padding: 40px; background-color:#ffffff; border-radius: 6px">
                      <div style="padding-bottom: 20px; font-size: 18px; font-weight: bold; text-align: center; color: #2F3044;">
                        Comprobante de Pago - Cita #{eventId}
                      </div>
                
                      <div style="padding-bottom: 15px; color: #5E6278;">
                        Estimado(a) {WebUtility.HtmlEncode(patientName)},
                      </div>
                      <div style="padding-bottom: 20px; color: #5E6278;">
                        Adjuntamos el comprobante de pago para tu cita con {WebUtility.HtmlEncode(doctorName)} en {WebUtility.HtmlEncode(clinicName)}.
                      </div>
                
                      <hr style="border: none; border-top: 1px solid #eeeeee; margin: 20px 0;" />
                
                      <div style="padding-bottom: 10px; color: #2F3044;"><strong>Detalles de la Cita:</strong></div>
                      <div style="padding-bottom: 5px; color: #5E6278;"><strong>Servicio:</strong> {WebUtility.HtmlEncode(serviceName)}</div>
                      <div style="padding-bottom: 20px; color: #5E6278;"><strong>Fecha y Hora:</strong> {eventDate.ToString("f", culture)}</div>
                
                      <div style="padding-bottom: 10px; color: #2F3044;"><strong>Detalles del Pago:</strong></div>
                      <div style="padding-bottom: 5px; color: #5E6278;"><strong>Fecha de Pago:</strong> {paymentDate.ToString("f", culture)}</div>
                      <div style="padding-bottom: 5px; color: #5E6278;"><strong>Método de Pago:</strong> {WebUtility.HtmlEncode(paymentMethodName)}</div>
                      {(string.IsNullOrEmpty(referenceNumber) ? "" : $"<div style=\"padding-bottom: 5px; color: #5E6278;\"><strong>Referencia:</strong> {WebUtility.HtmlEncode(referenceNumber)}</div>")}
                      {(string.IsNullOrEmpty(notes) ? "" : $"<div style=\"padding-bottom: 20px; color: #5E6278;\"><strong>Notas:</strong> {WebUtility.HtmlEncode(notes)}</div>")}
                
                      <div style="padding-top: 10px; padding-bottom: 10px; font-size: 16px; font-weight: bold; color: #2F3044;"><strong>Monto Pagado:</strong> {amountPaid.ToString("C", culture)}</div>
                
                      <hr style="border: none; border-top: 1px solid #eeeeee; margin: 20px 0;" />
                
                      <div style="padding-top: 10px; font-size: 13px; color: #6d6e7c;">
                        Si tienes alguna pregunta sobre este comprobante, por favor contacta a tu especialista.
                      </div>
                      <div style="padding-top: 5px; font-size: 13px; color: #6d6e7c;">
                        Gracias por tu preferencia.
                      </div>
                    </div>
                  </td>
                </tr>
                {GetEmailFooter()}
                """;
    }

     public string CreateAccountDeletionEmail(AppUser user)
    {
        var firstName = WebUtility.HtmlEncode(user.FirstName);

        return $"""
                {GetEmailHeader()}
                <tr>
                  <td align="left" valign="center">
                    <div class="content-div" style="text-align:left; margin: 0 20px; padding: 40px; background-color:#ffffff; border-radius: 6px">
                      <div style="padding-bottom: 20px; font-size: 17px;">
                        <strong>Confirmación de Eliminación de Cuenta</strong>
                      </div>
                      <div style="padding-bottom: 20px; color: #5E6278;">
                        Hola {firstName},
                      </div>
                      <div style="padding-bottom: 20px; color: #5E6278;">
                        Confirmamos que tu cuenta en DocHub ha sido eliminada según tu solicitud.
                      </div>
                      <div style="padding-bottom: 30px; color: #5E6278;">
                        Agradecemos el tiempo que pasaste con nosotros y esperamos que hayas encontrado útil nuestra plataforma.
                      </div>
                      <div style="padding-bottom: 10px; color: #5E6278;">
                        Toda la información asociada a tu cuenta ha sido eliminada de acuerdo con nuestra política de privacidad.
                      </div>

                      <div style="border-bottom: 1px solid #eeeeee; margin: 20px 0;"></div>
                      <div style="padding-top: 10px; font-size: 13px; color: #6d6e7c;">
                        Si no solicitaste esta acción o crees que fue un error, por favor contacta a nuestro equipo de soporte inmediatamente.
                      </div>
                       <div style="padding-top: 5px; font-size: 13px; color: #6d6e7c;">
                        Te deseamos lo mejor.
                      </div>
                    </div>
                  </td>
                </tr>
                {GetEmailFooter()}
                """;
    }

    public async Task SendOrderPaymentRequestEmailAsync(AppUser patient, Order order, string paymentUrl)
    {
        if (patient == null) throw new ArgumentNullException(nameof(patient));
        if (order == null) throw new ArgumentNullException(nameof(order));
        if (string.IsNullOrEmpty(patient.Email))
        {
            Log.Warning("Cannot send order payment request email for Order ID {OrderId}: Patient email is missing.",
                order.Id);
            return;
        }

        var subject = $"DocHub | Tu pedido #{order.Id} está lista para pago";
        var htmlBody = CreateOrderPaymentRequestEmailHtml(patient, order, paymentUrl);

        try
        {
            await SendMail(patient.Email, subject, htmlBody);
            Log.Information("Order payment request email sent successfully to {Email} for Order ID {OrderId}.",
                patient.Email, order.Id);
        }
        catch (Exception ex)
        {
            Log.Error(ex, "Failed to send order payment request email to {Email} for Order ID {OrderId}.",
                patient.Email, order.Id);
        }
    }


    private string CreateOrderPaymentRequestEmailHtml(AppUser patient, Order order, string paymentUrl)
    {
        var culture = new CultureInfo("es-MX");
        var productTableHtml = new StringBuilder();
        var defaultImageUrl = "https://dochub.mx/img/placeholder.png";


        productTableHtml.AppendLine("""
                                    <table width="100%" style="border-collapse: collapse; margin-top: 20px; margin-bottom: 30px;">
                                      <thead>
                                        <tr>
                                          <th style="border: 1px solid #dddddd; text-align: left; padding: 8px;">Imagen</th>
                                          <th style="border: 1px solid #dddddd; text-align: left; padding: 8px;">Producto</th>
                                          <th style="border: 1px solid #dddddd; text-align: center; padding: 8px;">Cantidad</th>
                                          <th style="border: 1px solid #dddddd; text-align: right; padding: 8px;">Precio Unit.</th>
                                          <th style="border: 1px solid #dddddd; text-align: right; padding: 8px;">Subtotal</th>
                                        </tr>
                                      </thead>
                                      <tbody>
                                    """);


        foreach (var item in order.OrderItems)
        {
            if (item.Product == null)
            {
                Log.Warning(
                    "Product details missing for OrderItem ProductId {ProductId} in Order ID {OrderId} during email generation.",
                    item.ProductId, order.Id);
                continue;
            }

            var imageUrl = item.Product.GetPhotoUrl() ?? defaultImageUrl;

            if (imageUrl == "img/placeholder.png" && item.Product.ProductPhotos.Count > 0 &&
                item.Product.ProductPhotos.First().Photo?.Url != null)
            {
                imageUrl = item.Product.ProductPhotos.First().Photo.Url.AbsoluteUri ?? defaultImageUrl;
            }
            else if (imageUrl == "img/placeholder.png")
            {
                imageUrl = defaultImageUrl;
            }


            var productName = WebUtility.HtmlEncode(item.Product.Name ?? "N/A");
            var dosageUnit = WebUtility.HtmlEncode($"{item.Product.Dosage} {item.Product.Unit}".Trim());
            var quantity = item.Quantity ?? 0;
            var unitPrice = item.Price ?? 0m;
            var subtotal = (item.Price * item.Quantity) ?? 0m;

            productTableHtml.AppendLine($"""
                                         <tr>
                                           <td style="border: 1px solid #dddddd; padding: 8px; text-align: center;"><img src="{imageUrl}" alt="{productName}" style="width: 60px; height: auto; max-height: 60px; object-fit: contain;" /></td>
                                           <td style="border: 1px solid #dddddd; padding: 8px;">{productName}<br/><small style="color: #5E6278;">{dosageUnit}</small></td>
                                           <td style="border: 1px solid #dddddd; padding: 8px; text-align: center;">{quantity}</td>
                                           <td style="border: 1px solid #dddddd; padding: 8px; text-align: right;">{unitPrice.ToString("C", culture)}</td>
                                           <td style="border: 1px solid #dddddd; padding: 8px; text-align: right;">{subtotal.ToString("C", culture)}</td>
                                         </tr>
                                         """);
        }


        productTableHtml.AppendLine($"""
                                       <tr>
                                         <td colspan="4" style="border: 1px solid #dddddd; text-align: right; padding: 8px;"><strong>Total a Pagar:</strong></td>
                                         <td style="border: 1px solid #dddddd; text-align: right; padding: 8px;"><strong>{order.Total?.ToString("C", culture) ?? 0m.ToString("C", culture)}</strong></td>
                                       </tr>
                                     </tbody>
                                     </table>
                                     """);


        return $"""
                {GetEmailHeader()}
                <tr>
                  <td align="left" valign="center">
                    <div class="content-div" style="text-align:left; margin: 0 20px; padding: 40px; background-color:#ffffff; border-radius: 6px">
                      <div style="padding-bottom: 20px; font-size: 17px;">
                        <strong>Hola {WebUtility.HtmlEncode(patient.FirstName)},</strong>
                      </div>
                      <div style="padding-bottom: 20px; color: #5E6278;">
                        Tu orden #{order.Id} que incluye productos de venta general está lista. Puedes proceder al pago haciendo clic en el siguiente botón:
                      </div>
                
                      {productTableHtml}
                
                      <div style="text-align: center; padding-bottom: 30px;">
                        <a href="{paymentUrl}" target="_blank" class="cta-button" rel="noopener" style="display: inline-block; text-decoration: none; background-color: #284092; color: #ffffff; padding: 12px 25px; font-size: 16px; font-weight: bold; border-radius: 6px;">
                          Pagar Orden #{order.Id}
                        </a>
                      </div>
                
                      <div style="border-bottom: 1px solid #eeeeee; margin: 20px 0;"></div>
                      <div style="padding-top: 10px; font-size: 13px; color: #6d6e7c;">
                        Si tienes alguna pregunta sobre tu orden, por favor contacta a tu especialista o responde a este correo.
                      </div>
                    </div>
                  </td>
                </tr>
                {GetEmailFooter()}
                """;
        
    }
}
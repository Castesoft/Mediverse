using System.Net;
using System.Net.Mail;
using MainService.Core.Interfaces.Services;
using MainService.Core.Settings;
using MainService.Models.Entities;
using Microsoft.Extensions.Options;

namespace MainService.Infrastructure.Services;
public class EmailService : IEmailService
{
    private readonly EmailSettings _emailSettings;
    public EmailService(IOptions<EmailSettings> emailSettings)
    {
        _emailSettings = emailSettings.Value;
    }

    public string CreateResetPasswordEmail(AppUser user, string resetUrl)
    {
        return $$"""
                <html>
                    <body>
                        <div style='padding: 2rem; background-color: #e9ecef;'>
                        <div style='width: 100%; max-width: 600px; margin: auto;'>
                            <div
                            style='background-color: white; padding: 1.5rem; border-radius: 40px; box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15)!important; text-align: center;'>
                            <p style='color: #888; font-size: 22px; margin-bottom:40px;'>
                                ¡Hola {{user.FirstName}}! 👋
                            </p>
                            <p style='color: #888; font-size: 22px; margin-bottom:40px;'>
                                ¡No te preocupes! 🌟 Si necesitas restablecer tu contraseña, simplemente haz clic en el enlace de abajo 🖱️ y
                                elige una nueva:
                            </p>
                            <a href='{{resetUrl}}' target='_blank' style='display: inline-block; font-weight: 300; text-transform: uppercase;
                                color: #fff; background-color: #479eb1;
                                border-color: #479eb1;
                                padding: 0.375rem 0.75rem;
                                font-size: 1.25rem; line-height: 1.5;
                                border-radius: 0.3rem; text-decoration: none;
                                margin-bottom: 40px;
                                font-weight: bold;
                                '>
                                Enlace de recuperación de contraseña 🔗
                            </a>
                            <p style='color: #888; font-size: 22px; margin-bottom:40px;'>
                                Si no solicitaste una nueva contraseña, por favor ignora este correo. 🚫 Para cualquier duda o asistencia
                                adicional, estamos aquí para ayudarte. 🤝
                            </p>
                            </div>
                        </div>
                        </div>
                    </body>
                    </html>
            """;
    }

    public string CreateVerifyEmailAddressEmailForRegister(AppUser user, string verificationUrl, string verificationCode)
    {
        string cssFilePath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "email-styles", "styles.css");
        string cssContent = File.ReadAllText(cssFilePath);

        var htmlContent = $$"""
<html><body>
    <section class="border border-0 border-bottom" style="padding-top: 30px; padding-bottom: 60px;">
      <div class="container-fluid container-lg" style="max-width: 1320px;">
        <div class="row d-flex align-items-center">
          <div class="col" style="width: 50%;">
            <h1 class="display-4 fw-bold mb-4 lh-1">
              Gracias por crear una cuenta con MS2FASample de Castesoft
            </h1>
            <p class="mb-4">
              ¡Hola {{user.FirstName}} {{user.LastName}} nos alegra verte con nosotros!
            </p>
            <a href="{{verificationUrl}}" class="btn btn-dark btn-lg">
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
                <code class="font-monospace fs-2 fw-light p-3 bg-body-tertiary rounded-4">{{verificationCode}}</code>
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

        var inlineResult = PreMailer.Net.PreMailer.MoveCssInline(htmlContent, css: cssContent);

        string inlinedHtmlContent = inlineResult.Html;

        return inlinedHtmlContent;
    }

    public string CreateVerifyEmailAddressEmailForUpdate(AppUser user, string verificationCode)
    {
        string cssFilePath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "email-styles", "styles.css");
        string cssContent = File.ReadAllText(cssFilePath);

        var htmlContent = $$"""
    <html>
        <body>
                <h1>¡Hola {{user.FirstName}}!</h1>
                <p>¡Gracias por actualizar tu correo electrónico! 🌟</p>
                <p>Para concluir la actualización, por favor verifica tu correo electrónico usando el código a continuación:</p>
                <code>{{verificationCode}}</code>
                <p>Si no solicitaste esta actualización, por favor ignora este correo. 🚫</p>
        </body>
    </html>
""";

        var inlineResult = PreMailer.Net.PreMailer.MoveCssInline(htmlContent, css: cssContent);

        string inlinedHtmlContent = inlineResult.Html;

        return inlinedHtmlContent;
    }

    public async Task SendMail(string to, string subject, string htmlMessage)
    {
        var message = new MailMessage
        {
            From = new MailAddress(_emailSettings.FromAddress),
            Subject = subject,
            Body = htmlMessage,
            IsBodyHtml = true
        };

        message.To.Add(to);

        using var client = new SmtpClient
        {
            Host = _emailSettings.SmtpHost,
            Port = _emailSettings.SmtpPort,
            Credentials = new NetworkCredential(_emailSettings.SmtpUser, _emailSettings.SmtpPass),
            EnableSsl = true
        };

        await client.SendMailAsync(message);
    }
}
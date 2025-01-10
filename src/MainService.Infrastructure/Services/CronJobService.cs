using MainService.Core.Interfaces.Services;
using MainService.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;

namespace MainService.Infrastructure.Services
{
    public class CronJobsService(IServiceProvider serviceProvider) : BackgroundService
    {
        private static async Task SendSatisfactionSurveysEmailAsync(DataContext dbContext, IEmailService emailService)
        {
            Console.WriteLine("Entering SendSatisfactionSurveysEmailAsync");
            var thirtyMinutesAgo = DateTime.UtcNow.AddMinutes(-30);
            var events = await dbContext.Events
                .Where(e => e.DateTo <= thirtyMinutesAgo && !e.IsSatisfactionSurveyEmailSent)
                    .Include(e => e.PatientEvent)
                        .ThenInclude(pe => pe.Patient)
                    .Include(e => e.DoctorEvent)
                        .ThenInclude(de => de.Doctor)
                    .Include(e => e.EventService)
                        .ThenInclude(es => es.Service)
                    .ToListAsync();

            switch (events.Count)
            {
                case 0:
                    Console.WriteLine("No events found to send satisfaction survey email");
                    return;
                case > 2: // TODO: Remove this after testing
                {
                    foreach (var @event in events)
                        @event.IsSatisfactionSurveyEmailSent = true;
                    Console.WriteLine($"More than 5 events found to send satisfaction survey email: {events.Count}");
                    await dbContext.SaveChangesAsync();
                    return;
                }
            }

            foreach (var @event in events)
            {
                if (@event.PatientEvent?.Patient == null || @event.DoctorEvent?.Doctor == null)
                {
                    Console.WriteLine($"Skipping event {@event.Id} due to missing patient or doctor information");
                    continue;
                }

                var patientEmail = @event.PatientEvent.Patient.Email;
                if (string.IsNullOrEmpty(patientEmail))
                {
                    Console.WriteLine($"Skipping event {@event.Id} due to missing patient email");
                    continue;
                }

                const string subject = "🔒 DocHub: cuentanos tu experiencia!";
                var htmlMessage = emailService.CreateSatisfactionSurveyEmail(@event.DoctorEvent.Doctor,
                    @event.PatientEvent.Patient, @event);

                try
                {
                    await emailService.SendMail(patientEmail, subject, htmlMessage);
                    @event.IsSatisfactionSurveyEmailSent = true;
                }
                catch (Exception ex)
                {
                    Console.WriteLine($"Failed to send email for event {@event.Id}: {ex.Message}");
                }
            }

            await dbContext.SaveChangesAsync();
        }

        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            while (!stoppingToken.IsCancellationRequested)
            {
                using var scope = serviceProvider.CreateScope();
                var dbContext = scope.ServiceProvider.GetRequiredService<DataContext>();
                var emailService = scope.ServiceProvider.GetRequiredService<IEmailService>();

                await SendSatisfactionSurveysEmailAsync(dbContext, emailService);

                await Task.Delay(TimeSpan.FromMinutes(1), stoppingToken);
            }
        }
    }
}
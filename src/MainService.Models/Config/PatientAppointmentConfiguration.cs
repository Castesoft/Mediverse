using MainService.Models.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace MainService.Models.Config;

public class PatientAppointmentConfiguration : IEntityTypeConfiguration<PatientAppointment>
{
    public void Configure(EntityTypeBuilder<PatientAppointment> builder)
    {
        builder.HasKey(x =>
            new
            {
                x.PatientId,
                x.AppointmentId
            });

        builder.HasOne(x => x.Patient)
            .WithMany(x => x.PatientAppointments)
            .HasForeignKey(x => x.PatientId)
            .OnDelete(DeleteBehavior.Cascade);
        
        builder.HasOne(x => x.Appointment)
            .WithOne(x => x.PatientAppointment)
            .HasForeignKey<PatientAppointment>(x => x.AppointmentId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}
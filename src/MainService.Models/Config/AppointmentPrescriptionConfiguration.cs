using MainService.Models.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace MainService.Models.Config;

public class AppointmentPrescriptionConfiguration : IEntityTypeConfiguration<AppointmentPrescription>
{
    public void Configure(EntityTypeBuilder<AppointmentPrescription> builder)
    {
        builder.HasKey(x =>
            new
            {
                x.AppointmentId,
                x.PrescriptionId
            });

        builder.HasOne(x => x.Appointment)
            .WithMany(x => x.AppointmentPrescriptions)
            .HasForeignKey(x => x.AppointmentId)
            .OnDelete(DeleteBehavior.Cascade);
        
        builder.HasOne(x => x.Prescription)
            .WithOne(x => x.AppointmentPrescription)
            .HasForeignKey<AppointmentPrescription>(x => x.PrescriptionId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}
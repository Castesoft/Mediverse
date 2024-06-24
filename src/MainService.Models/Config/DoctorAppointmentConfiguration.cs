using MainService.Models.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace MainService.Models.Config;

public class DoctorAppointmentConfiguration : IEntityTypeConfiguration<DoctorAppointment>
{
    public void Configure(EntityTypeBuilder<DoctorAppointment> builder)
    {
        builder.HasKey(x =>
            new
            {
                x.DoctorId,
                x.AppointmentId
            });

        builder.HasOne(x => x.Doctor)
            .WithMany(x => x.DoctorAppointments)
            .HasForeignKey(x => x.DoctorId)
            .OnDelete(DeleteBehavior.Cascade);
        
        builder.HasOne(x => x.Appointment)
            .WithOne(x => x.DoctorAppointment)
            .HasForeignKey<DoctorAppointment>(x => x.AppointmentId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}
using MainService.Models.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace MainService.Models.Config;

public class DoctorPatientConfiguration : IEntityTypeConfiguration<DoctorPatient>
{
    public void Configure(EntityTypeBuilder<DoctorPatient> builder)
    {
        builder.HasKey(dp => new { dp.DoctorId, dp.PatientId });

        builder
            .HasOne(dp => dp.Doctor)
            .WithMany(u => u.Patients)
            .HasForeignKey(dp => dp.DoctorId)
            .OnDelete(DeleteBehavior.Cascade);


        builder
            .HasOne(dp => dp.Patient)
            .WithMany(u => u.Doctors)
            .HasForeignKey(dp => dp.PatientId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}
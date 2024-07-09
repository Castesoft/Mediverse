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
            .HasOne(s => s.Doctor)
            .WithMany(l => l.Patients)
            .HasForeignKey(s => s.DoctorId)
            .OnDelete(DeleteBehavior.Cascade);

        builder
            .HasOne(s => s.Patient)
            .WithMany(l => l.Doctors)
            .HasForeignKey(s => s.PatientId)
            .OnDelete(DeleteBehavior.NoAction);
    }
}
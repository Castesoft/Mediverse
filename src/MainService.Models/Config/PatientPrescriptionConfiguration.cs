using MainService.Models.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace MainService.Models.Config;
public class PatientPrescriptionConfiguration : IEntityTypeConfiguration<PatientPrescription>
{
    public void Configure(EntityTypeBuilder<PatientPrescription> builder)
    {
        builder.HasKey(x => new { x.PatientId, x.PrescriptionId });

        builder.HasOne(x => x.Patient)
            .WithMany(x => x.PatientPrescriptions)
            .HasForeignKey(x => x.PatientId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasOne(x => x.Prescription)
            .WithOne(x => x.PatientPrescription)
            .HasForeignKey<PatientPrescription>(x => x.PrescriptionId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}
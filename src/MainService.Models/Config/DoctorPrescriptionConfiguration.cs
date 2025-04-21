using MainService.Models.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace MainService.Models.Config;

public class DoctorPrescriptionConfiguration : IEntityTypeConfiguration<DoctorPrescription>
{
    public void Configure(EntityTypeBuilder<DoctorPrescription> builder)
    {
        builder.HasKey(x => new { x.DoctorId, x.PrescriptionId });

        builder.HasOne(x => x.Doctor)
            .WithMany(x => x.DoctorPrescriptions)
            .HasForeignKey(x => x.DoctorId)
            .OnDelete(DeleteBehavior.NoAction);

        builder.HasOne(x => x.Prescription)
            .WithOne(x => x.DoctorPrescription)
            .HasForeignKey<DoctorPrescription>(x => x.PrescriptionId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}
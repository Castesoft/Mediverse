using MainService.Models.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace MainService.Models.Config;

public class PrescriptionMedicineConfiguration : IEntityTypeConfiguration<PrescriptionMedicine>
{
    public void Configure(EntityTypeBuilder<PrescriptionMedicine> builder)
    {
        builder.HasKey(x =>
            new
            {
                x.PrescriptionId,
                x.MedicineId
            });

        builder.HasOne(x => x.Prescription)
            .WithMany(x => x.PrescriptionMedicines)
            .HasForeignKey(x => x.PrescriptionId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasOne(x => x.Medicine)
            .WithMany(x => x.PrescriptionMedicines)
            .HasForeignKey(x => x.MedicineId)
            .IsRequired(false)
            .OnDelete(DeleteBehavior.SetNull);
    }
}
using MainService.Models.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace MainService.Models.Config;

public class PrescriptionItemConfiguration : IEntityTypeConfiguration<PrescriptionItem>
{
    public void Configure(EntityTypeBuilder<PrescriptionItem> builder)
    {
        builder.HasKey(x =>
            new
            {
                x.PrescriptionId,
                x.MedicineId
            });

        builder.HasOne(x => x.Prescription)
            .WithMany(x => x.PrescriptionItems)
            .HasForeignKey(x => x.PrescriptionId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasOne(x => x.Medicine)
            .WithMany(x => x.PrescriptionItems)
            .HasForeignKey(x => x.MedicineId)
            .IsRequired(false)
            .OnDelete(DeleteBehavior.SetNull);
    }
}
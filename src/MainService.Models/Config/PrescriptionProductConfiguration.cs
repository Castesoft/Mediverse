using MainService.Models.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace MainService.Models.Config;

public class PrescriptionProductConfiguration : IEntityTypeConfiguration<PrescriptionProduct>
{
    public void Configure(EntityTypeBuilder<PrescriptionProduct> builder)
    {
        builder.HasOne(x => x.Prescription)
            .WithMany(x => x.PrescriptionItems)
            .HasForeignKey(x => x.PrescriptionId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasOne(x => x.Product)
            .WithMany(x => x.PrescriptionProducts)
            .HasForeignKey(x => x.ProductId)
            .IsRequired(false)
            .OnDelete(DeleteBehavior.NoAction);
    }
}
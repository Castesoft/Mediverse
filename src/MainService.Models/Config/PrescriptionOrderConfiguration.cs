using MainService.Models.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace MainService.Models.Config;
public class PrescriptionOrderConfiguration : IEntityTypeConfiguration<PrescriptionOrder>
{
    public void Configure(EntityTypeBuilder<PrescriptionOrder> builder)
    {
        builder.HasKey(x => new { x.PrescriptionId, x.OrderId });

        builder.HasOne(x => x.Prescription)
            .WithOne(x => x.PrescriptionOrder)
            .HasForeignKey<PrescriptionOrder>(x => x.PrescriptionId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasOne(x => x.Order)
            .WithOne(x => x.PrescriptionOrder)
            .HasForeignKey<PrescriptionOrder>(x => x.OrderId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}
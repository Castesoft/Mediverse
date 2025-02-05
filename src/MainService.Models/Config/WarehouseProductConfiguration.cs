using MainService.Models.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace MainService.Models.Config
{
    public class WarehouseProductConfiguration : IEntityTypeConfiguration<WarehouseProduct>
    {
        public void Configure(EntityTypeBuilder<WarehouseProduct> builder)
        {
            builder.HasKey(wp => new { wp.WarehouseId, wp.ProductId });

            builder.HasOne(wp => wp.Warehouse)
                .WithMany(w => w.WarehouseProducts)
                .HasForeignKey(wp => wp.WarehouseId)
                .OnDelete(DeleteBehavior.Cascade);

            builder.HasOne(wp => wp.Product)
                .WithMany(p => p.WarehouseProducts)
                .HasForeignKey(wp => wp.ProductId)
                .OnDelete(DeleteBehavior.Cascade);

            builder.Property(wp => wp.Quantity)
                .IsRequired();

            builder.Property(wp => wp.ReservedQuantity)
                .HasDefaultValue(0);

            builder.Property(wp => wp.DamagedQuantity)
                .HasDefaultValue(0);

            builder.Property(wp => wp.OnHoldQuantity)
                .HasDefaultValue(0);

            builder.Property(wp => wp.ReorderLevel)
                .HasDefaultValue(0);

            builder.Property(wp => wp.SafetyStock)
                .HasDefaultValue(0);

            builder.Property(wp => wp.LastUpdated)
                .IsRequired();

            builder.Property(wp => wp.LotNumber)
                .HasMaxLength(50);

            builder.Ignore(wp => wp.SellableQuantity);
            builder.Ignore(wp => wp.IsAvailable);
        }
    }
}
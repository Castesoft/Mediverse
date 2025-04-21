using MainService.Models.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace MainService.Models.Config
{
    public class OrderConfiguration : IEntityTypeConfiguration<Order>
    {
        public void Configure(EntityTypeBuilder<Order> builder)
        {
            builder.HasMany(o => o.Payments)
                .WithOne(p => p.Order)
                .HasForeignKey(p => p.OrderId)
                .IsRequired(false)
                .OnDelete(DeleteBehavior.Cascade);


            builder.HasMany(o => o.OrderHistories)
                .WithOne(oh => oh.Order)
                .HasForeignKey(oh => oh.OrderId)
                .IsRequired()
                .OnDelete(DeleteBehavior.Cascade);

            builder.Property(o => o.PaymentStatus)
                .IsRequired()
                .HasConversion<string>()
                .HasMaxLength(50);
        }
    }
}
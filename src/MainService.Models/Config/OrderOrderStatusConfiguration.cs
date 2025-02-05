using MainService.Models.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace MainService.Models.Config
{
    public class OrderOrderStatusConfiguration : IEntityTypeConfiguration<OrderOrderStatus>
    {
        public void Configure(EntityTypeBuilder<OrderOrderStatus> builder)
        {
            builder.HasKey(x => new { x.OrderId, x.OrderStatusId });

            builder
                .HasOne(x => x.Order)
                .WithOne(x => x.OrderOrderStatus)
                .HasForeignKey<OrderOrderStatus>(x => x.OrderId)
                .OnDelete(DeleteBehavior.Cascade);

            builder
                .HasOne(x => x.OrderStatus)
                .WithMany(x => x.OrderOrderStatuses)
                .HasForeignKey(x => x.OrderStatusId)
                .OnDelete(DeleteBehavior.Cascade);
        }
    }
}
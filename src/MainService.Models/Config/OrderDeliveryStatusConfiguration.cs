using MainService.Models.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace MainService.Models.Config
{
    public class OrderDeliveryStatusConfiguration : IEntityTypeConfiguration<OrderDeliveryStatus>
    {
        public void Configure(EntityTypeBuilder<OrderDeliveryStatus> builder)
        {
            builder.HasKey(x => new { x.OrderId, x.DeliveryStatusId });

            builder
                .HasOne(x => x.Order)
                .WithOne(x => x.OrderDeliveryStatus)
                .HasForeignKey<OrderDeliveryStatus>(x => x.OrderId)
                .OnDelete(DeleteBehavior.Cascade)
            ;

            builder
                .HasOne(x => x.DeliveryStatus)
                .WithMany(x => x.OrderDeliveryStatuses)
                .HasForeignKey(x => x.DeliveryStatusId)
                .OnDelete(DeleteBehavior.Cascade)
            ;
        }
    }
}
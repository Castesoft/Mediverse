using MainService.Models.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace MainService.Models.Config;
public class OrderDeliveryAddressConfiguration : IEntityTypeConfiguration<OrderDeliveryAddress>
{
    public void Configure(EntityTypeBuilder<OrderDeliveryAddress> builder)
    {
        builder.HasKey(x => new { x.OrderId, x.AddressId });

        builder
            .HasOne(x => x.Order)
            .WithOne(x => x.OrderDeliveryAddress)
            .HasForeignKey<OrderDeliveryAddress>(x => x.OrderId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasOne(x => x.DeliveryAddress)
            .WithMany(x => x.OrderDeliveryAddresses)
            .HasForeignKey(x => x.AddressId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}
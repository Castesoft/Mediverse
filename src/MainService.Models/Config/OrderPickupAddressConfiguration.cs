using MainService.Models.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace MainService.Models.Config;
public class OrderPickupAddressConfiguration : IEntityTypeConfiguration<OrderPickupAddress>
{
    public void Configure(EntityTypeBuilder<OrderPickupAddress> builder)
    {
        builder.HasKey(x => new { x.OrderId, x.AddressId });

        builder
            .HasOne(x => x.Order)
            .WithOne(x => x.OrderPickupAddress)
            .HasForeignKey<OrderPickupAddress>(x => x.OrderId)
            .OnDelete(DeleteBehavior.Cascade)
        ;

        builder.HasOne(x => x.PickupAddress)
            .WithMany(x => x.OrderPickupAddresses)
            .HasForeignKey(x => x.AddressId)
            .OnDelete(DeleteBehavior.Cascade)
        ;
    }
}
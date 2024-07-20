using MainService.Models.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace MainService.Models.Config;
public class OrderAddressConfiguration : IEntityTypeConfiguration<OrderAddress>
{
    public void Configure(EntityTypeBuilder<OrderAddress> builder)
    {
        builder.HasKey(x => new { x.OrderId, x.AddressId });

        builder.HasOne(x => x.Order)
            .WithOne(x => x.OrderAddress)
            .HasForeignKey<OrderAddress>(x => x.OrderId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasOne(x => x.Address)
            .WithMany(x => x.OrderAddresses)
            .HasForeignKey(x => x.AddressId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}
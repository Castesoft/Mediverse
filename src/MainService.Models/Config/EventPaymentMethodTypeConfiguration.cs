using MainService.Models.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace MainService.Models.Config;

public class EventPaymentMethodTypeConfiguration : IEntityTypeConfiguration<EventPaymentMethodType>
{
    public void Configure(EntityTypeBuilder<EventPaymentMethodType> builder)
    {
        builder.HasKey(x =>
            new
            {
                x.EventId,
                x.PaymentMethodTypeId
            });

        builder.HasOne(x => x.Event)
            .WithOne(x => x.EventPaymentMethodType)
            .HasForeignKey<EventPaymentMethodType>(x => x.EventId)
            .OnDelete(DeleteBehavior.Cascade);

        builder
            .HasOne(x => x.PaymentMethodType)
            .WithMany(x => x.EventPaymentMethodTypes)
            .HasForeignKey(x => x.PaymentMethodTypeId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}
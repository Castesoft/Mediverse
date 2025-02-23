using MainService.Models.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace MainService.Models.Config;

public class PaymentConfiguration : IEntityTypeConfiguration<Payment>
{
    public void Configure(EntityTypeBuilder<Payment> builder)
    {
        builder.Property(p => p.Amount)
            .HasColumnType("decimal(18,2)")
            .IsRequired();

        builder.Property(p => p.Currency)
            .HasMaxLength(10)
            .IsRequired();

        builder.Property(p => p.StripePaymentIntent)
            .HasMaxLength(100);
        builder.Property(p => p.StripePaymentId)
            .HasMaxLength(100);
        builder.Property(p => p.StripeInvoiceId)
            .HasMaxLength(100);

        builder.Property(p => p.PaymentStatus)
            .HasConversion<string>()
            .IsRequired();

        builder.HasOne(p => p.Event)
            .WithMany(e => e.Payments)
            .HasForeignKey(p => p.EventId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasOne(p => p.Order)
            .WithMany(o => o.Payments)
            .HasForeignKey(p => p.OrderId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}
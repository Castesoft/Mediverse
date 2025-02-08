using MainService.Models.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace MainService.Models.Config;

public class SubscriptionConfiguration : IEntityTypeConfiguration<Subscription>
{
    public void Configure(EntityTypeBuilder<Subscription> builder)
    {
        builder.HasOne(s => s.SubscriptionPlan)
            .WithMany(p => p.Subscriptions)
            .HasForeignKey(s => s.SubscriptionPlanId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.Property(s => s.Status)
            .HasConversion<string>()
            .IsRequired();

        builder.HasMany(s => s.SubscriptionHistories)
            .WithOne(sh => sh.Subscription)
            .HasForeignKey(sh => sh.SubscriptionId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}
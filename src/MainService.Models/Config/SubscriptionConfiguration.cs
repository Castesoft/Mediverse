using MainService.Models.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace MainService.Models.Config;

public class SubscriptionConfiguration : IEntityTypeConfiguration<UserSubscription>
{
    public void Configure(EntityTypeBuilder<UserSubscription> builder)
    {
        builder
            .Property(s => s.Status)
            .HasConversion<string>()
            .IsRequired();

        builder
            .HasOne(s => s.SubscriptionPlan)
            .WithMany(p => p.Subscriptions)
            .HasForeignKey(s => s.SubscriptionPlanId)
            .OnDelete(DeleteBehavior.Cascade);

        builder
            .HasMany(s => s.SubscriptionHistories)
            .WithOne(sh => sh.UserSubscription)
            .HasForeignKey(sh => sh.UserSubscriptionId)
            .OnDelete(DeleteBehavior.Cascade);

        builder
            .HasMany(s => s.SubscriptionCancellations)
            .WithOne(sc => sc.UserSubscription)
            .HasForeignKey(sc => sc.UserSubscriptionId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}
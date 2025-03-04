using MainService.Models.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace MainService.Models.Config;

public class SubscriptionCancellationConfiguration : IEntityTypeConfiguration<SubscriptionCancellation>
{
    public void Configure(EntityTypeBuilder<SubscriptionCancellation> builder)
    {
        builder
            .Property(sc => sc.Feedback)
            .HasMaxLength(1500);

        builder
            .HasOne(sc => sc.User)
            .WithMany(u => u.SubscriptionCancellations)
            .HasForeignKey(sc => sc.UserId)
            .OnDelete(DeleteBehavior.Cascade);

        builder
            .HasOne(sc => sc.UserSubscription)
            .WithMany(us => us.SubscriptionCancellations)
            .HasForeignKey(sc => sc.UserSubscriptionId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}
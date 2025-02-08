using MainService.Models.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace MainService.Models.Config;

public class SubscriptionHistoryConfiguration : IEntityTypeConfiguration<SubscriptionHistory>
{
    public void Configure(EntityTypeBuilder<SubscriptionHistory> builder)
    {
        builder.Property(sh => sh.OldStatus)
            .HasConversion<string>()
            .IsRequired();

        builder.Property(sh => sh.NewStatus)
            .HasConversion<string>()
            .IsRequired();
    }
}
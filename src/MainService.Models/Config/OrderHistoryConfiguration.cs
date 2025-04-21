using MainService.Models.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace MainService.Models.Config
{
    public class OrderHistoryConfiguration : IEntityTypeConfiguration<OrderHistory>
    {
        public void Configure(EntityTypeBuilder<OrderHistory> builder)
        {
            builder.HasOne(oh => oh.Order)
                .WithMany(o => o.OrderHistories)
                .HasForeignKey(oh => oh.OrderId)
                .IsRequired()
                .OnDelete(DeleteBehavior.Cascade);

            builder.HasOne(oh => oh.User)
                .WithMany()
                .HasForeignKey(oh => oh.UserId)
                .IsRequired(false)
                .OnDelete(DeleteBehavior.SetNull);


            builder.Property(oh => oh.ChangeType)
                .IsRequired()
                .HasConversion<string>()
                .HasMaxLength(50);

            builder.Property(oh => oh.Property)
                .IsRequired()
                .HasConversion<string>()
                .HasMaxLength(50);

            builder.Property(oh => oh.OldValue)
                .IsRequired(false);

            builder.Property(oh => oh.NewValue)
                .IsRequired(false);

            builder.HasIndex(oh => oh.OrderId);
            builder.HasIndex(oh => oh.UserId);
        }
    }
}
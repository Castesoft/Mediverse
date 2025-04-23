using MainService.Models.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace MainService.Models.Config;

public class InvitationConfiguration : IEntityTypeConfiguration<Invitation>
{
    public void Configure(EntityTypeBuilder<Invitation> builder)
    {
        builder
            .Property(i => i.InviteeEmail)
            .IsRequired()
            .HasMaxLength(500);

        builder
            .Property(i => i.RoleInvitedAs)
            .IsRequired()
            .HasMaxLength(50);

        builder
            .Property(i => i.Token)
            .IsRequired()
            .HasMaxLength(100);

        builder
            .Property(i => i.ExpiryDate)
            .IsRequired();

        builder
            .Property(i => i.Status)
            .IsRequired()
            .HasConversion<string>();

        builder.HasIndex(i => i.Token).IsUnique();
        builder.HasIndex(i => i.ExpiryDate);
        builder.HasIndex(i => i.Status);

        builder.HasOne(i => i.InvitingUser)
            .WithMany()
            .HasForeignKey(i => i.InvitingUserId)
            .IsRequired()
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasOne(i => i.AcceptedUser)
            .WithMany()
            .HasForeignKey(i => i.AcceptedUserId)
            .IsRequired(false)
            .OnDelete(DeleteBehavior.SetNull);
    }
}
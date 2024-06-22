using MainService.Models.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace MainService.Models.Config;
public class AppUserConfiguration : IEntityTypeConfiguration<AppUser>
{
    public void Configure(EntityTypeBuilder<AppUser> builder)
    {
        builder.Property(x => x.Email).HasMaxLength(500);
        builder.Property(x => x.FirstName).HasMaxLength(500);
        builder.Property(x => x.LastName).HasMaxLength(500);
        builder.Property(x => x.Sex).HasMaxLength(10);
        builder.Property(x => x.PhoneNumber).HasMaxLength(20);
        builder.Property(x => x.PhoneNumberCountryCode).HasMaxLength(5);
        builder.Property(x => x.DateOfBirth).HasMaxLength(100);
        builder.Property(x => x.LastActive).HasMaxLength(100);
        builder.Property(x => x.EmailVerificationExpiryTime).HasMaxLength(100);
        builder.Property(x => x.PhoneNumberVerificationExpiryTime).HasMaxLength(100);

        builder
            .HasOne(x => x.UserPhoto)
            .WithOne(x => x.User)
            .HasForeignKey<UserPhoto>(x => x.UserId)
            .OnDelete(DeleteBehavior.Cascade);

        builder
            .HasMany(x => x.UserRoles)
            .WithOne(x => x.User)
            .HasForeignKey(x => x.UserId)
            .OnDelete(DeleteBehavior.Cascade);

        builder
            .HasMany(x => x.UserPermissions)
            .WithOne(x => x.User)
            .HasForeignKey(x => x.UserId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}
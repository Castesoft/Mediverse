using MainService.Models.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace MainService.Models.Config;

public class UserMedicalLicenseConfiguration : IEntityTypeConfiguration<UserMedicalLicense>
{
    public void Configure(EntityTypeBuilder<UserMedicalLicense> builder)
    {
        builder.HasKey(x => new { x.UserId, x.MedicalLicenseId });

        builder.HasOne(x => x.User)
            .WithMany(x => x.UserMedicalLicenses)
            .HasForeignKey(x => x.UserId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasOne(x => x.MedicalLicense)
            .WithOne(x => x.UserMedicalLicense)
            .HasForeignKey<UserMedicalLicense>(x => x.MedicalLicenseId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}
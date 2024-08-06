using MainService.Models.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace MainService.Models.Config;
public class UserMedicalLicenseConfiguration : IEntityTypeConfiguration<UserMedicalLicense>
{
    public void Configure(EntityTypeBuilder<UserMedicalLicense> builder)
    {
        builder.HasKey(x => new { x.UserId, x.MedicalLicenseId });
    }
}
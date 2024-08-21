using MainService.Models.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace MainService.Models.Config;
public class UserMedicalInsuranceCompanyConfiguration : IEntityTypeConfiguration<UserMedicalInsuranceCompany>
{
    public void Configure(EntityTypeBuilder<UserMedicalInsuranceCompany> builder)
    {
        builder.HasKey(x => new { x.UserId, x.MedicalInsuranceCompanyId });

        builder.HasOne(x => x.User)
            .WithMany(x => x.UserMedicalInsuranceCompanies)
            .HasForeignKey(x => x.UserId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasOne(x => x.MedicalInsuranceCompany)
            .WithMany(x => x.UserMedicalInsuranceCompanies)
            .HasForeignKey(x => x.MedicalInsuranceCompanyId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}
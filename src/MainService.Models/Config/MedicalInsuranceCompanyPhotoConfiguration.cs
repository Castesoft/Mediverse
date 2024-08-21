using MainService.Models.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace MainService.Models.Config;
public class MedicalInsuranceCompanyPhotoConfiguration : IEntityTypeConfiguration<MedicalInsuranceCompanyPhoto>
{
    public void Configure(EntityTypeBuilder<MedicalInsuranceCompanyPhoto> builder)
    {
        builder.HasKey(x => new { x.MedicalInsuranceCompanyId, x.PhotoId });

        builder
            .HasOne(x => x.Photo)
            .WithOne(x => x.MedicalInsuranceCompanyPhoto)
            .HasForeignKey<MedicalInsuranceCompanyPhoto>(x => x.PhotoId)
            .OnDelete(DeleteBehavior.Cascade);

        builder
            .HasOne(x => x.MedicalInsuranceCompany)
            .WithOne(x => x.MedicalInsuranceCompanyPhoto)
            .HasForeignKey<MedicalInsuranceCompanyPhoto>(x => x.MedicalInsuranceCompanyId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}
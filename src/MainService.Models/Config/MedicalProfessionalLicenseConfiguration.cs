using MainService.Models.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace MainService.Models.Config;

public class MedicalProfessionalLicenseConfiguration : IEntityTypeConfiguration<MedicalProfessionalLicense>
{
    public void Configure(EntityTypeBuilder<MedicalProfessionalLicense> builder)
    {
        builder.HasKey(x =>
            new
            {
                x.SpecialistSpecificationId,
                x.MedicalLicenseId
            });

        builder.HasOne(x => x.SpecialistSpecification)
            .WithMany(x => x.MedicalProfessionalLicenses)
            .HasForeignKey(x => x.SpecialistSpecificationId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasOne(x => x.MedicalLicense)
            .WithOne(x => x.MedicalProfessionalLicense)
            .HasForeignKey<MedicalProfessionalLicense>(x => x.MedicalLicenseId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}
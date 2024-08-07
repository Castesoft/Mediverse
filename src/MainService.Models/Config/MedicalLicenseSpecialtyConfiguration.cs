using MainService.Models.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace MainService.Models.Config;
public class MedicalLicenseSpecialtyConfiguration : IEntityTypeConfiguration<MedicalLicenseSpecialty>
{
    public void Configure(EntityTypeBuilder<MedicalLicenseSpecialty> builder)
    {
        builder.HasKey(x => new { x.MedicalLicenseId, x.SpecialtyId });
    }
}
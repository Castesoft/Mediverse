using MainService.Models.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace MainService.Models.Config;
public class MedicalLicenseSubSpecialtyConfiguration : IEntityTypeConfiguration<MedicalLicenseSubSpecialty>
{
    public void Configure(EntityTypeBuilder<MedicalLicenseSubSpecialty> builder)
    {
        builder.HasKey(x => new { x.MedicalLicenseId, x.SubSpecialtyId });
    }
}
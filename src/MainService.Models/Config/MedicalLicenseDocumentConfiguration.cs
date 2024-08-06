using MainService.Models.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace MainService.Models.Config;
public class MedicalLicenseDocumentConfiguration : IEntityTypeConfiguration<MedicalLicenseDocument>
{
    public void Configure(EntityTypeBuilder<MedicalLicenseDocument> builder)
    {
        builder.HasKey(x => new { x.MedicalLicenseId, x.DocumentId });
    }
}
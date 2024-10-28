using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace MainService.Models.Config;

public class DocumentConfiguration : IEntityTypeConfiguration<Entities.Document>
{
    public void Configure(EntityTypeBuilder<Entities.Document> builder)
    {
        builder
            .HasOne(x => x.UserMedicalInsuranceCompany)
            .WithOne(x => x.Document)
            .OnDelete(DeleteBehavior.NoAction);
    }
}
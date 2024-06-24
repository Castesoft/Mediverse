using MainService.Models.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace MainService.Models.Config;

public class PrescriptionLogoConfiguration : IEntityTypeConfiguration<PrescriptionLogo>
{
    public void Configure(EntityTypeBuilder<PrescriptionLogo> builder)
    {
        builder.HasKey(x =>
            new
            {
                x.PrescriptionId,
                x.PhotoId
            });

        builder.HasOne(x => x.Prescription)
            .WithOne(x => x.PrescriptionLogo)
            .HasForeignKey<PrescriptionLogo>(x => x.PrescriptionId)
            .OnDelete(DeleteBehavior.Cascade);
        
        builder.HasOne(x => x.Photo)
            .WithOne(x => x.PrescriptionLogo)
            .HasForeignKey<PrescriptionLogo>(x => x.PhotoId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}
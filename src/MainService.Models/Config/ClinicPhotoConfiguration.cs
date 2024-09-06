using MainService.Models.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace MainService.Models.Config;
public class ClinicLogoConfiguration : IEntityTypeConfiguration<ClinicLogo>
{
    public void Configure(EntityTypeBuilder<ClinicLogo> builder)
    {
        builder.HasKey(x => new { x.AddressId, x.PhotoId });

        builder
            .HasOne(x => x.Photo)
            .WithOne(x => x.ClinicLogo)
            .HasForeignKey<ClinicLogo>(x => x.PhotoId)
            .OnDelete(DeleteBehavior.Cascade);

        builder
            .HasOne(x => x.Address)
            .WithOne(x => x.ClinicLogo)
            .HasForeignKey<ClinicLogo>(x => x.AddressId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}
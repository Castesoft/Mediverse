using MainService.Models.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace MainService.Models.Config;
public class DoctorBannerPhotoConfiguration : IEntityTypeConfiguration<DoctorBannerPhoto>
{
    public void Configure(EntityTypeBuilder<DoctorBannerPhoto> builder)
    {
        builder.HasKey(x => new { x.UserId, x.PhotoId });

        builder
            .HasOne(x => x.Photo)
            .WithOne(x => x.DoctorBannerPhoto)
            .HasForeignKey<DoctorBannerPhoto>(x => x.PhotoId)
            .OnDelete(DeleteBehavior.Cascade);

        builder
            .HasOne(x => x.User)
            .WithOne(x => x.DoctorBannerPhoto)
            .HasForeignKey<DoctorBannerPhoto>(x => x.UserId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}
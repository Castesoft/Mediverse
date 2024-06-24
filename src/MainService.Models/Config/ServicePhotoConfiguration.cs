using MainService.Models.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace MainService.Models.Config;
public class ServicePhotoConfiguration : IEntityTypeConfiguration<ServicePhoto>
{
    public void Configure(EntityTypeBuilder<ServicePhoto> builder)
    {
        builder.HasKey(x => new { x.ServiceId, x.PhotoId });

        builder
            .HasOne(x => x.Service)
            .WithMany(x => x.ServicePhotos)
            .HasForeignKey(x => x.ServiceId)
            .OnDelete(DeleteBehavior.Cascade);

        builder
            .HasOne(x => x.Photo)
            .WithOne(x => x.ServicePhoto)
            .HasForeignKey<ServicePhoto>(x => x.PhotoId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}
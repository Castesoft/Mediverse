using MainService.Models.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace MainService.Models.Config;
public class PhotoConfiguration : IEntityTypeConfiguration<Photo>
{
    public void Configure(EntityTypeBuilder<Photo> builder)
    {
        builder
            .HasOne(x => x.UserPhoto)
            .WithOne(x => x.Photo)
            .HasForeignKey<UserPhoto>(x => x.PhotoId)
            .OnDelete(DeleteBehavior.Cascade);

        builder
            .HasOne(x => x.ServicePhoto)
            .WithOne(x => x.Photo)
            .HasForeignKey<ServicePhoto>(x => x.PhotoId)
            .OnDelete(DeleteBehavior.Cascade);

        builder
            .HasOne(x => x.ProductPhoto)
            .WithOne(x => x.Photo)
            .HasForeignKey<ProductPhoto>(x => x.PhotoId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}
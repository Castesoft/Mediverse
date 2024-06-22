using MainService.Models.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace MainService.Models.Config;
public class ProductPhotoConfiguration : IEntityTypeConfiguration<ProductPhoto>
{
    public void Configure(EntityTypeBuilder<ProductPhoto> builder)
    {
        builder.HasKey(x => new { x.ProductId, x.PhotoId });

        builder
            .HasOne(x => x.Product)
            .WithMany(x => x.ProductPhotos)
            .HasForeignKey(x => x.ProductId)
            .OnDelete(DeleteBehavior.NoAction);

        builder
            .HasOne(x => x.Photo)
            .WithOne(x => x.ProductPhoto)
            .HasForeignKey<ProductPhoto>(x => x.PhotoId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}
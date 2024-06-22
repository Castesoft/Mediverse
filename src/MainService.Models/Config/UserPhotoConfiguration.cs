using MainService.Models.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace MainService.Models.Config;
public class UserPhotoConfiguration : IEntityTypeConfiguration<UserPhoto>
{
    public void Configure(EntityTypeBuilder<UserPhoto> builder)
    {
        builder.HasKey(x => new { x.UserId, x.PhotoId });

        builder
            .HasOne(x => x.Photo)
            .WithOne(x => x.UserPhoto)
            .HasForeignKey<UserPhoto>(x => x.PhotoId)
            .OnDelete(DeleteBehavior.Cascade);

        builder
            .HasOne(x => x.User)
            .WithOne(x => x.UserPhoto)
            .HasForeignKey<UserPhoto>(x => x.UserId)
            .OnDelete(DeleteBehavior.NoAction);
    }
}
using MainService.Models.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace MainService.Models.Config
{
    public class ClinicPhotoConfiguration : IEntityTypeConfiguration<ClinicPhoto>
    {
        public void Configure(EntityTypeBuilder<ClinicPhoto> builder)
        {
            builder.HasKey(x => new { x.ClinicId, x.PhotoId });

            builder
                .HasOne(x => x.Photo)
                .WithOne(x => x.ClinicPhoto)
                .HasForeignKey<ClinicPhoto>(x => x.PhotoId)
                .OnDelete(DeleteBehavior.Cascade)
            ;

            builder
                .HasOne(x => x.Clinic)
                .WithMany(x => x.ClinicPhotos)
                .HasForeignKey(x => x.ClinicId)
                .OnDelete(DeleteBehavior.Cascade)
            ;
        }
    }
}
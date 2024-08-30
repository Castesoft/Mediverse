using MainService.Models.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace MainService.Models.Config
{
    public class DoctorReviewConfiguration : IEntityTypeConfiguration<DoctorReview>
    {
        public void Configure(EntityTypeBuilder<DoctorReview> builder)
        {
            builder.HasKey(x => new { x.DoctorId, x.ReviewId });

            builder
                .HasOne(x => x.Doctor)
                .WithMany(x => x.DoctorReviews)
                .HasForeignKey(x => x.DoctorId)
                .OnDelete(DeleteBehavior.Cascade);

            builder
                .HasOne(x => x.Review)
                .WithOne(x => x.DoctorReview)
                .HasForeignKey<DoctorReview>(x => x.ReviewId)
                .OnDelete(DeleteBehavior.Cascade);
        }
    }
}
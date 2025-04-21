using MainService.Models.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace MainService.Models.Config;

public class UserReviewConfiguration : IEntityTypeConfiguration<UserReview>
{
    public void Configure(EntityTypeBuilder<UserReview> builder)
    {
        builder.HasKey(x => new { x.UserId, x.ReviewId });

        builder
            .HasOne(x => x.User)
            .WithMany(x => x.UserReviews)
            .HasForeignKey(x => x.UserId)
            .OnDelete(DeleteBehavior.NoAction);

        builder
            .HasOne(x => x.Review)
            .WithOne(x => x.UserReview)
            .HasForeignKey<UserReview>(x => x.ReviewId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}
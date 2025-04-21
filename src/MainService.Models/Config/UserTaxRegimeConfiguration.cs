using MainService.Models.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace MainService.Models.Config;

public class UserTaxRegimeConfiguration : IEntityTypeConfiguration<UserTaxRegime>
{
    public void Configure(EntityTypeBuilder<UserTaxRegime> builder)
    {
        builder.HasKey(x => new { x.UserId, x.TaxRegimeId });

        builder.HasOne(x => x.User)
            .WithMany(u => u.UserTaxRegimes)
            .HasForeignKey(utr => utr.UserId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasOne(x => x.TaxRegime)
            .WithOne(t => t.UserTaxRegime)
            .HasForeignKey<UserTaxRegime>(utr => utr.TaxRegimeId)
            .OnDelete(DeleteBehavior.Restrict);
    }
}
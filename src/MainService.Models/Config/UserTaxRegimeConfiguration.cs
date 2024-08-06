using MainService.Models.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace MainService.Models.Config;
public class UserTaxRegimeConfiguration : IEntityTypeConfiguration<UserTaxRegime>
{
    public void Configure(EntityTypeBuilder<UserTaxRegime> builder)
    {
        builder.HasKey(x => new { x.UserId, x.TaxRegimeId });
    }
}
using MainService.Models.Entities.Addresses;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace MainService.Models.Config;
public class StateCityConfiguration : IEntityTypeConfiguration<StateCity>
{
    public void Configure(EntityTypeBuilder<StateCity> builder)
    {
        builder.HasKey(x => new { x.StateId, x.CityId });

        builder.HasOne(x => x.State)
            .WithMany(x => x.StateCities)
            .HasForeignKey(x => x.StateId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasOne(x => x.City)
            .WithOne(x => x.StateCity)
            .HasForeignKey<StateCity>(x => x.CityId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}
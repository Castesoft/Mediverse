using MainService.Models.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace MainService.Models.Config;
public class CityNeighborhoodConfiguration : IEntityTypeConfiguration<CityNeighborhood>
{
    public void Configure(EntityTypeBuilder<CityNeighborhood> builder)
    {
        builder.HasKey(x => new { x.CityId, x.NeighborhoodId });

        builder.HasOne(x => x.City)
            .WithMany(x => x.CityNeighborhoods)
            .HasForeignKey(x => x.CityId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasOne(x => x.Neighborhood)
            .WithOne(x => x.CityNeighborhood)
            .HasForeignKey<CityNeighborhood>(x => x.NeighborhoodId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}
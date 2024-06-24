using MainService.Models.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace MainService.Models.Config;

public class LocationPhoneConfiguration : IEntityTypeConfiguration<LocationPhone>
{
    public void Configure(EntityTypeBuilder<LocationPhone> builder)
    {
        builder.HasKey(x =>
            new
            {
                x.LocationId,
                x.PhoneId
            });

        builder.HasOne(x => x.Location)
            .WithMany(x => x.LocationPhones)
            .HasForeignKey(x => x.LocationId)
            .OnDelete(DeleteBehavior.Cascade);
        
        builder.HasOne(x => x.Phone)
            .WithOne(x => x.LocationPhone)
            .HasForeignKey<LocationPhone>(x => x.PhoneId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}
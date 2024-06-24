using MainService.Models.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace MainService.Models.Config;

public class DoctorLinkConfiguration : IEntityTypeConfiguration<DoctorLink>
{
    public void Configure(EntityTypeBuilder<DoctorLink> builder)
    {
        builder.HasKey(x =>
            new
            {
                x.DoctorId,
                x.LinkId
            });

        builder.HasOne(x => x.Doctor)
            .WithMany(x => x.DoctorLinks)
            .HasForeignKey(x => x.DoctorId)
            .OnDelete(DeleteBehavior.Cascade);
        
        builder.HasOne(x => x.Link)
            .WithOne(x => x.DoctorLink)
            .HasForeignKey<DoctorLink>(x => x.LinkId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}
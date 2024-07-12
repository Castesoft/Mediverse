using MainService.Models.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace MainService.Models.Config;
public class DoctorServiceConfiguration : IEntityTypeConfiguration<DoctorService>
{
    public void Configure(EntityTypeBuilder<DoctorService> builder)
    {
        builder.HasKey(x => new { x.DoctorId, x.ServiceId });

        builder.HasOne(x => x.Doctor)
            .WithMany(x => x.DoctorServices)
            .HasForeignKey(x => x.DoctorId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasOne(x => x.Service)
            .WithOne(x => x.DoctorService)
            .HasForeignKey<DoctorService>(x => x.ServiceId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}
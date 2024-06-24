using MainService.Models.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace MainService.Models.Config;

public class DoctorInformationConfiguration : IEntityTypeConfiguration<DoctorInformation>
{
    public void Configure(EntityTypeBuilder<DoctorInformation> builder)
    {
        builder.HasKey(x =>
            new
            {
                x.DoctorId,
                x.InformationId
            });

        builder.HasOne(x => x.Doctor)
            .WithOne(x => x.DoctorInformation)
            .HasForeignKey<DoctorInformation>(x => x.DoctorId)
            .OnDelete(DeleteBehavior.Cascade);
        
        builder.HasOne(x => x.Information)
            .WithOne(x => x.DoctorInformation)
            .HasForeignKey<DoctorInformation>(x => x.InformationId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}
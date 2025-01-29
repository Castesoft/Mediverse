using MainService.Models.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace MainService.Models.Config;

public class DoctorSpecialtyConfiguration : IEntityTypeConfiguration<DoctorSpecialty>
{
    public void Configure(EntityTypeBuilder<DoctorSpecialty> builder)
    {
        builder.HasKey(x =>
            new
            {
                x.DoctorId,
                x.SpecialtyId
            });

        builder.HasOne(x => x.Doctor)
            .WithOne(x => x.DoctorSpecialty)
            .HasForeignKey<DoctorSpecialty>(x => x.DoctorId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasOne(x => x.Specialty)
            .WithMany(x => x.DoctorSpecialties)
            .HasForeignKey(x => x.SpecialtyId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}
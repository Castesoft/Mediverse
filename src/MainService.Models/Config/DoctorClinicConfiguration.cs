using MainService.Models.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace MainService.Models.Config;

public class DoctorClinicConfiguration : IEntityTypeConfiguration<DoctorClinic>
{
    public void Configure(EntityTypeBuilder<DoctorClinic> builder)
    {
        builder.HasKey(x =>
            new
            {
                x.DoctorId,
                x.ClinicId
            });

        builder.HasOne(x => x.Doctor)
            .WithMany(x => x.DoctorClinics)
            .HasForeignKey(x => x.DoctorId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasOne(x => x.Clinic)
            .WithOne(x => x.DoctorClinic)
            .HasForeignKey<DoctorClinic>(x => x.ClinicId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}
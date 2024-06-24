using MainService.Models.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace MainService.Models.Config;

public class NurseClinicConfiguration : IEntityTypeConfiguration<NurseClinic>
{
    public void Configure(EntityTypeBuilder<NurseClinic> builder)
    {
        builder.HasKey(x =>
            new
            {
                x.NurseId,
                x.ClinicId
            });

        builder.HasOne(x => x.Nurse)
            .WithOne(x => x.NurseClinic)
            .HasForeignKey<NurseClinic>(x => x.NurseId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasOne(x => x.Clinic)
            .WithMany(x => x.NurseClinics)
            .HasForeignKey(x => x.ClinicId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}
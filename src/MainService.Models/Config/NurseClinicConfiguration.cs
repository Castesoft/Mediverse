using MainService.Models.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace MainService.Models.Config;

public class ClinicNurseConfiguration : IEntityTypeConfiguration<ClinicNurse>
{
    public void Configure(EntityTypeBuilder<ClinicNurse> builder)
    {
        builder.HasKey(x =>
            new
            {
                x.NurseId,
                x.ClinicId
            });

        builder.HasOne(x => x.Nurse)
            .WithMany(x => x.ClinicNurses)
            .HasForeignKey(x => x.NurseId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasOne(x => x.Clinic)
            .WithMany(x => x.ClinicNurses)
            .HasForeignKey(x => x.ClinicId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}
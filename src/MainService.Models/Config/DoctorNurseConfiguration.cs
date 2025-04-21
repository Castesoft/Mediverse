using MainService.Models.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace MainService.Models.Config;

public class DoctorNurseConfiguration : IEntityTypeConfiguration<DoctorNurse>
{
    public void Configure(EntityTypeBuilder<DoctorNurse> builder)
    {
        builder.HasKey(x => new { x.DoctorId, x.NurseId });

        builder.HasOne(x => x.Doctor)
            .WithMany(x => x.DoctorNurses)
            .HasForeignKey(x => x.DoctorId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasOne(x => x.Nurse)
            .WithMany(x => x.NursesDoctor)
            .HasForeignKey(x => x.NurseId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}
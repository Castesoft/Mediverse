using MainService.Models.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace MainService.Models.Config;

public class DoctorWorkScheduleConfiguration : IEntityTypeConfiguration<DoctorWorkSchedule>
{
    public void Configure(EntityTypeBuilder<DoctorWorkSchedule> builder)
    {
        builder.HasKey(x => new { x.UserId, x.WorkScheduleId });

        builder.HasOne(x => x.User)
            .WithMany(x => x.DoctorWorkSchedules)
            .HasForeignKey(x => x.UserId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasOne(x => x.WorkSchedule)
            .WithOne(x => x.DoctorWorkSchedule)
            .HasForeignKey<DoctorWorkSchedule>(x => x.WorkScheduleId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}

public class DoctorWorkScheduleSettingsConfiguration : IEntityTypeConfiguration<DoctorWorkScheduleSettings>
{
    public void Configure(EntityTypeBuilder<DoctorWorkScheduleSettings> builder)
    {
        builder.HasKey(x => new { x.UserId, x.WorkScheduleSettingsId });
    }
}
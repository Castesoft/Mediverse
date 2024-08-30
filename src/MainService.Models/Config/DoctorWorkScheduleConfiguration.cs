using MainService.Models.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace MainService.Models.Config
{
    public class DoctorWorkScheduleConfiguration : IEntityTypeConfiguration<DoctorWorkSchedule>
    {
        public void Configure(EntityTypeBuilder<DoctorWorkSchedule> builder)
        {
            builder.HasKey(x => new { x.UserId, x.WorkScheduleId });
        }
    }

    public class DoctorWorkScheduleSettingsConfiguration : IEntityTypeConfiguration<DoctorWorkScheduleSettings>
    {
        public void Configure(EntityTypeBuilder<DoctorWorkScheduleSettings> builder)
        {
            builder.HasKey(x => new { x.UserId, x.WorkScheduleSettingsId });
        }
    }
}
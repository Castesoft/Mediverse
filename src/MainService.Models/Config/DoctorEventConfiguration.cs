using MainService.Models.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace MainService.Models.Config;

public class DoctorEventConfiguration : IEntityTypeConfiguration<DoctorEvent>
{
    public void Configure(EntityTypeBuilder<DoctorEvent> builder)
    {
        builder.HasKey(x =>
            new
            {
                x.DoctorId,
                x.EventId
            });

        builder.HasOne(x => x.Doctor)
            .WithMany(x => x.DoctorEvents)
            .HasForeignKey(x => x.DoctorId)
            .OnDelete(DeleteBehavior.Cascade);
        
        builder.HasOne(x => x.Event)
            .WithOne(x => x.DoctorEvent)
            .HasForeignKey<DoctorEvent>(x => x.EventId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}
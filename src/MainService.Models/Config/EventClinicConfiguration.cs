using MainService.Models.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace MainService.Models.Config;

public class EventClinicConfiguration : IEntityTypeConfiguration<EventClinic>
{
    public void Configure(EntityTypeBuilder<EventClinic> builder)
    {
        builder.HasKey(x =>
            new
            {
                x.EventId,
                x.ClinicId
            });

        builder.HasOne(x => x.Event)
            .WithOne(x => x.EventClinic)
            .HasForeignKey<EventClinic>(x => x.EventId)
            .OnDelete(DeleteBehavior.Cascade);

        builder
            .HasOne(x => x.Clinic)
            .WithMany(x => x.EventClinics)
            .HasForeignKey(x => x.ClinicId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}
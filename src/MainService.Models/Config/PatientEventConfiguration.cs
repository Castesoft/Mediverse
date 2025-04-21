using MainService.Models.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace MainService.Models.Config;

public class PatientEventConfiguration : IEntityTypeConfiguration<PatientEvent>
{
    public void Configure(EntityTypeBuilder<PatientEvent> builder)
    {
        builder.HasKey(x =>
            new
            {
                x.PatientId,
                x.EventId
            });

        builder.HasOne(x => x.Patient)
            .WithMany(x => x.PatientEvents)
            .HasForeignKey(x => x.PatientId)
            .OnDelete(DeleteBehavior.NoAction);

        builder.HasOne(x => x.Event)
            .WithOne(x => x.PatientEvent)
            .HasForeignKey<PatientEvent>(x => x.EventId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}
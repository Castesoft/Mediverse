using MainService.Models.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace MainService.Models.Config;

public class NurseEventConfiguration : IEntityTypeConfiguration<NurseEvent>
{
    public void Configure(EntityTypeBuilder<NurseEvent> builder)
    {
        builder.HasKey(x =>
            new
            {
                x.NurseId,
                x.EventId
            });

        builder.HasOne(x => x.Nurse)
            .WithMany(x => x.NurseEvents)
            .HasForeignKey(x => x.NurseId)
            .OnDelete(DeleteBehavior.NoAction);

        builder
            .HasOne(x => x.Event)
            .WithMany(x => x.NurseEvents)
            .HasForeignKey(x => x.EventId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}
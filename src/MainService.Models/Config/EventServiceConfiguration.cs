using MainService.Models.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace MainService.Models.Config;

public class EventServiceConfiguration : IEntityTypeConfiguration<EventService>
{
    public void Configure(EntityTypeBuilder<EventService> builder)
    {
        builder.HasKey(x =>
            new
            {
                x.EventId,
                x.ServiceId
            });

        builder.HasOne(x => x.Event)
            .WithOne(x => x.EventService)
            .HasForeignKey<EventService>(x => x.EventId)
            .OnDelete(DeleteBehavior.Cascade);

        builder
            .HasOne(x => x.Service)
            .WithMany(x => x.EventServices)
            .HasForeignKey(x => x.ServiceId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}
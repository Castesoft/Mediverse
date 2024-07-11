using MainService.Models.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace MainService.Models.Config;

public class EventPrescriptionConfiguration : IEntityTypeConfiguration<EventPrescription>
{
    public void Configure(EntityTypeBuilder<EventPrescription> builder)
    {
        builder.HasKey(x =>
            new
            {
                x.EventId,
                x.PrescriptionId
            });

        builder.HasOne(x => x.Event)
            .WithMany(x => x.EventPrescriptions)
            .HasForeignKey(x => x.EventId)
            .OnDelete(DeleteBehavior.Cascade);
        
        builder.HasOne(x => x.Prescription)
            .WithOne(x => x.EventPrescription)
            .HasForeignKey<EventPrescription>(x => x.PrescriptionId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}
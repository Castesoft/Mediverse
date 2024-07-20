using MainService.Models.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace MainService.Models.Config;
public class PatientOrderConfiguration : IEntityTypeConfiguration<PatientOrder>
{
    public void Configure(EntityTypeBuilder<PatientOrder> builder)
    {
        builder.HasKey(x => new { x.PatientId, x.OrderId });

        builder.HasOne(x => x.Patient)
            .WithMany(x => x.PatientOrders)
            .HasForeignKey(x => x.PatientId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasOne(x => x.Order)
            .WithOne(x => x.PatientOrder)
            .HasForeignKey<PatientOrder>(x => x.OrderId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}
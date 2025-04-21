using MainService.Models.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace MainService.Models.Config;

public class DoctorOrderConfiguration : IEntityTypeConfiguration<DoctorOrder>
{
    public void Configure(EntityTypeBuilder<DoctorOrder> builder)
    {
        builder.HasKey(x => new { x.DoctorId, x.OrderId });

        builder.HasOne(x => x.Doctor)
            .WithMany(x => x.DoctorOrders)
            .HasForeignKey(x => x.DoctorId)
            .OnDelete(DeleteBehavior.NoAction);

        builder.HasOne(x => x.Order)
            .WithOne(x => x.DoctorOrder)
            .HasForeignKey<DoctorOrder>(x => x.OrderId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}
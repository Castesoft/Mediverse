using MainService.Models.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace MainService.Models.Config;

public class DoctorProductConfiguration : IEntityTypeConfiguration<DoctorProduct>
{
    public void Configure(EntityTypeBuilder<DoctorProduct> builder)
    {
        builder.HasKey(x => new { x.DoctorId, x.ProductId });

        builder.HasOne(x => x.Doctor)
            .WithMany(x => x.DoctorProducts)
            .HasForeignKey(x => x.DoctorId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasOne(x => x.Product)
            .WithOne(x => x.DoctorProduct)
            .HasForeignKey<DoctorProduct>(x => x.ProductId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}
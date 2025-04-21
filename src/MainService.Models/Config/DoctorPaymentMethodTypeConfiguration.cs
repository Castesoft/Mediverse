using MainService.Models.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace MainService.Models.Config;

public class DoctorPaymentMethodTypeConfiguration : IEntityTypeConfiguration<DoctorPaymentMethodType>
{
    public void Configure(EntityTypeBuilder<DoctorPaymentMethodType> builder)
    {
        builder.HasKey(x => new { x.DoctorId, x.PaymentMethodTypeId });

        builder.HasOne(x => x.Doctor)
            .WithMany(x => x.DoctorPaymentMethodTypes)
            .HasForeignKey(x => x.DoctorId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasOne(x => x.PaymentMethodType)
            .WithMany(x => x.DoctorPaymentMethodTypes)
            .HasForeignKey(x => x.PaymentMethodTypeId)
            .OnDelete(DeleteBehavior.Restrict);
    }
}
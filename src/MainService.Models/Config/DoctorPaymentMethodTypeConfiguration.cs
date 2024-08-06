using MainService.Models.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace MainService.Models.Config;
public class DoctorPaymentMethodTypeConfiguration : IEntityTypeConfiguration<DoctorPaymentMethodType>
{
    public void Configure(EntityTypeBuilder<DoctorPaymentMethodType> builder)
    {
        builder.HasKey(x => new { x.DoctorId, x.PaymentMethodTypeId });
    }
}
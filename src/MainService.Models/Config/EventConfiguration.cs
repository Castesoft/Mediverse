using MainService.Models.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace MainService.Models.Config
{
    public class PaymentPaymentMethodConfiguration : IEntityTypeConfiguration<PaymentPaymentMethod>
    {
        public void Configure(EntityTypeBuilder<PaymentPaymentMethod> builder)
        {
            builder.HasKey(x => new { x.PaymentId, x.PaymentMethodId });

            builder
                .HasOne(x => x.Payment)
                .WithOne(x => x.PaymentPaymentMethod)
                .HasForeignKey<PaymentPaymentMethod>(x => x.PaymentId)
                .OnDelete(DeleteBehavior.Cascade);

            builder
                .HasOne(x => x.PaymentMethod)
                .WithMany(x => x.PaymentPaymentMethods)
                .HasForeignKey(x => x.PaymentMethodId)
                .OnDelete(DeleteBehavior.Cascade);
        }
    }

    public class EventPaymentStatusConfiguration : IEntityTypeConfiguration<EventPaymentStatus>
    {
        public void Configure(EntityTypeBuilder<EventPaymentStatus> builder)
        {
            builder.HasKey(x => new { x.EventId, x.PaymentStatusId });

            builder
                .HasOne(x => x.Event)
                .WithOne(x => x.EventPaymentStatus)
                .HasForeignKey<EventPaymentStatus>(x => x.EventId)
                .OnDelete(DeleteBehavior.Cascade);

            builder
                .HasOne(x => x.PaymentStatus)
                .WithMany(x => x.EventPaymentStatuses)
                .HasForeignKey(x => x.PaymentStatusId)
                .OnDelete(DeleteBehavior.Cascade);
        }
    }
    
    public class PaymentStatusConfiguration : IEntityTypeConfiguration<PaymentStatus>
    {
        public void Configure(EntityTypeBuilder<PaymentStatus> builder)
        {
            
        }
    }    
    
    public class EventPaymentConfiguration : IEntityTypeConfiguration<EventPayment>
    {
        public void Configure(EntityTypeBuilder<EventPayment> builder)
        {
            builder.HasKey(x => new { x.EventId, x.PaymentId });

            builder
                .HasOne(x => x.Event)
                .WithMany(x => x.EventPayments)
                .HasForeignKey(x => x.EventId)
                .OnDelete(DeleteBehavior.Cascade);

            builder
                .HasOne(x => x.Payment)
                .WithOne(x => x.EventPayment)
                .HasForeignKey<EventPayment>(x => x.PaymentId)
                .OnDelete(DeleteBehavior.Cascade);
        }
    }

    public class PaymentPaymentMethodTypeConfiguration : IEntityTypeConfiguration<PaymentPaymentMethodType>
    {
        public void Configure(EntityTypeBuilder<PaymentPaymentMethodType> builder)
        {
            builder.HasKey(x => new { x.PaymentId, x.PaymentMethodTypeId });

            builder
                .HasOne(x => x.Payment)
                .WithOne(x => x.PaymentPaymentMethodType)
                .HasForeignKey<PaymentPaymentMethodType>(x => x.PaymentId)
                .OnDelete(DeleteBehavior.Cascade);

            builder
                .HasOne(x => x.PaymentMethodType)
                .WithMany(x => x.PaymentPaymentMethodTypes)
                .HasForeignKey(x => x.PaymentMethodTypeId)
                .OnDelete(DeleteBehavior.Cascade);
        }
    }
    
    public class PaymentConfiguration : IEntityTypeConfiguration<Payment>
    {
        public void Configure(EntityTypeBuilder<Payment> builder)
        {
            
        }
    }
    
    public class EventConfiguration : IEntityTypeConfiguration<Event>
    {
        public void Configure(EntityTypeBuilder<Event> builder)
        {

        }
    }
}
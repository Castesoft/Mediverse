using MainService.Core.DTOs.Events;
using MainService.Core.DTOs.User;
using MainService.Models.Entities;
using MainService.Models.Enums;

namespace MainService.Core.DTOs.Payment
{
    public class PaymentDto
    {
        public int Id { get; set; }
        public int? EventId { get; set; }
        public decimal Amount { get; set; }
        public string Currency { get; set; } = "MXN";
        public DateTime Date { get; set; }
        public string PaymentStatus { get; set; } = string.Empty;
        public string? StripePaymentIntent { get; set; }
        public string? StripePaymentId { get; set; }
        public string? StripeInvoiceId { get; set; }
        public UserPaymentMethodDto? PaymentMethod { get; set; }
        public ManualPaymentType? ManualPaymentType { get; set; }
        public PaymentMethodTypeDto? PaymentMethodType { get; set; }
        public EventSummaryDto? Event { get; set; }
        public int DoctorId { get; set; }
        
        // Fields required to create the payment via Stripe:
        public string CustomerStripeId { get; set; } = string.Empty;
        public string PaymentMethodId { get; set; } = string.Empty;
    }
}
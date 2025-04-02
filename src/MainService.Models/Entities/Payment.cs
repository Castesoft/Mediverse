using MainService.Models.Enums;

namespace MainService.Models.Entities;

public class Payment : BaseEntity
{
    public Payment()
    {
    }

    public decimal Amount { get; set; }
    public string Currency { get; set; } = "MXN";
    public DateTime Date { get; set; }
    public PaymentStatus PaymentStatus { get; set; }
    public PaymentProcessingMode PaymentProcessingMode { get; set; } = PaymentProcessingMode.Integrated;

    // --- Stripe Specific Fields ---
    public string? StripePaymentIntent { get; set; }

    public string? StripePaymentId { get; set; }
    public string? StripeInvoiceId { get; set; }
    public int? PaymentMethodId { get; set; }
    public PaymentMethod? PaymentMethod { get; set; }
    

    // --- Relationships ---
    public int? EventId { get; set; }
    public Event? Event { get; set; }
    public int? OrderId { get; set; }
    public Order? Order { get; set; }


    public ManualPaymentDetail? ManualPaymentDetail { get; set; }

    // For cash payments
    public int? MarkedPaidByUserId { get; set; }
    public AppUser? MarkedPaidByUser { get; set; }
}
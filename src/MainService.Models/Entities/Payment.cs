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

    // --- Partial Payment Fields ---
    public bool IsPartialPayment { get; set; } = false;
    public decimal FullAmount { get; set; }
    public decimal RemainingAmount { get; set; } = 0;

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

    // --- Manual Confirmation Specific Fields --- (Already exists)
    public ManualPaymentDetail? ManualPaymentDetail { get; set; }
    public int? MarkedPaidByUserId { get; set; }
    public AppUser? MarkedPaidByUser { get; set; }
}
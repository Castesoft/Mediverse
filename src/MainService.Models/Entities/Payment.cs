namespace MainService.Models.Entities;

public class Payment : BaseEntity
{
    public Payment()
    {
    }

    public decimal Amount { get; set; }
    public string Currency { get; set; } = "MXN";
    public DateTime PaymentDate { get; set; }
    public PaymentStatus PaymentStatus { get; set; }

    public string? StripePaymentIntent { get; set; }

    public string? StripePaymentId { get; set; }
    public string? StripeInvoiceId { get; set; }

    public int? EventId { get; set; }
    public Event? Event { get; set; }
}
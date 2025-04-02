namespace MainService.Models.Entities;

public class ManualPaymentDetail : BaseEntity
{
    public int PaymentId { get; set; }
    public Payment Payment { get; set; } = null!;

    public int PaymentMethodTypeId { get; set; }
    public PaymentMethodType PaymentMethodType { get; set; } = null!;

    public string? ReferenceNumber { get; set; }
    public string? Notes { get; set; }
}
namespace MainService.Core.DTOs.Payment;

public class CreatePaymentIntentResponseDto
{
    public string ClientSecret { get; set; } = string.Empty;
    public int? PaymentId { get; set; }
}
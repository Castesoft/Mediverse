namespace MainService.Core.DTOs.Payment;

public class CreatePaymentIntentRequestDto
{
    public int PaymentMethodId { get; set; }
    public int AddressId { get; set; }
}
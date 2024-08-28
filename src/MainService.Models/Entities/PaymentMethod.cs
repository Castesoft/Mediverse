namespace MainService.Models.Entities;
public class PaymentMethod : BaseEntity
{
    public PaymentMethod() { }
    public PaymentMethod(string brand, string stripePaymentMethodId)
    {
        Brand = brand;
        StripePaymentMethodId = stripePaymentMethodId;
    }

    public string DisplayName { get; set; }
    public string Last4 { get; set; }
    public string Brand { get; set; }
    public string Country { get; set; }
    public int ExpirationMonth { get; set; }
    public int ExpirationYear { get; set; }
    public string StripePaymentMethodId { get; set; }

    public UserPaymentMethod UserPaymentMethod { get; set; }
}
namespace MainService.Core.DTOs.User;

public class UserPaymentMethodDto
{
    public int Id { get; set; }
    public bool IsDefault { get; set; }
    public string? CardholderName { get; set; }
    public string? Funding { get; set; }
    public string? BillingAddress { get; set; }
    public string? BillingZipCode { get; set; }
    public string? BillingCity { get; set; }
    public string? BillingCountry { get; set; }
    public bool IsActive { get; set; }
    public string? DisplayName { get; set; }
    public string? Last4 { get; set; }
    public string? Brand { get; set; }
    public string? Country { get; set; }
    public int? ExpirationMonth { get; set; }
    public int? ExpirationYear { get; set; }
    public string? StripePaymentMethodId { get; set; }
}
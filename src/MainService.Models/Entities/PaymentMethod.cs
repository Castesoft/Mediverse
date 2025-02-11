namespace MainService.Models.Entities;

public class PaymentMethod : BaseEntity
{
    public PaymentMethod()
    {
    }

    public PaymentMethod(string brand, string stripePaymentMethodId)
    {
        Brand = brand;
        StripePaymentMethodId = stripePaymentMethodId;
    }

    #region Payment Method Metadata

    /// <summary>
    /// Indicates if this payment method is the default for the user.
    /// </summary>
    public bool IsDefault { get; set; } = false;

    /// <summary>
    /// The name of the cardholder.
    /// </summary>
    public string? CardholderName { get; set; }

    /// <summary>
    /// The funding type (e.g., "credit", "debit").
    /// </summary>
    public string? Funding { get; set; }

    /// <summary>
    /// The billing address.
    /// </summary>
    public string? BillingAddress { get; set; }

    /// <summary>
    /// The billing ZIP or postal code.
    /// </summary>
    public string? BillingZipCode { get; set; }

    /// <summary>
    /// The billing city.
    /// </summary>
    public string? BillingCity { get; set; }

    /// <summary>
    /// The billing country.
    /// </summary>
    public string? BillingCountry { get; set; }

    /// <summary>
    /// Flag indicating whether the payment method is active.
    /// </summary>
    public bool IsActive { get; set; } = true;

    #endregion

    #region Payment Instrument Details

    /// <summary>
    /// A display name for the payment method.
    /// </summary>
    public string? DisplayName { get; set; }

    /// <summary>
    /// The last four digits of the card.
    /// </summary>
    public string? Last4 { get; set; }

    /// <summary>
    /// The card brand (e.g., Visa, MasterCard).
    /// </summary>
    public string? Brand { get; set; }

    /// <summary>
    /// The country of the card issuer.
    /// </summary>
    public string? Country { get; set; }

    /// <summary>
    /// The expiration month of the card.
    /// </summary>
    public int? ExpirationMonth { get; set; }

    /// <summary>
    /// The expiration year of the card.
    /// </summary>
    public int? ExpirationYear { get; set; }

    /// <summary>
    /// The identifier for the payment method as provided by Stripe.
    /// </summary>
    public string? StripePaymentMethodId { get; set; }

    #endregion

    public int UserId { get; set; }
    public AppUser User { get; set; } = null!;
    public List<Payment> Payments { get; set; } = [];
}
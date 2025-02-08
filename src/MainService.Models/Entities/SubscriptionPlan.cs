namespace MainService.Models.Entities;

public class SubscriptionPlan : BaseEntity
{
    /// <summary>
    /// Gets or sets the monthly price (or price per billing cycle) in MXN.
    /// </summary>
    public decimal Price { get; set; }

    /// <summary>
    /// Gets or sets the billing frequency in months (1 = monthly, 12 = yearly, etc.).
    /// </summary>
    public int BillingFrequencyInMonths { get; set; }

    /// <summary>
    /// Gets or sets the optional Stripe Plan ID for direct integration.
    /// </summary>
    public string? StripePlanId { get; set; }

    /// <summary>
    /// Gets or sets the list of subscriptions using this plan.
    /// </summary>
    public List<Subscription> Subscriptions { get; set; } = [];
}
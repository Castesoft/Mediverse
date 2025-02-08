namespace MainService.Core.DTOs.Subscriptions;

public class SubscriptionPlanCreateDto
{
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public decimal Price { get; set; }
    public int BillingFrequencyInMonths { get; set; }
    public string? StripePlanId { get; set; }
}
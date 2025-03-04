namespace MainService.Core.DTOs.Subscriptions;

public class SubscriptionDto
{
    public int Id { get; set; }
    public int UserId { get; set; }
    public int PlanId { get; set; }
    public decimal Price { get; set; }
    public string PlanName { get; set; } = string.Empty;
    public DateTime StartDate { get; set; }
    public DateTime? EndDate { get; set; }
    public string Status { get; set; } = string.Empty;
    public DateTime? NextBillingDate { get; set; }
    public string? StripePlanId { get; set; }
    public string? StripeSubscriptionId { get; set; }
    public string? StripeCustomerId { get; set; }
}
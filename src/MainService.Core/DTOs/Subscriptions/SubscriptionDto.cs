namespace MainService.Core.DTOs.Subscriptions;

public class SubscriptionDto
{
    public int Id { get; set; }
    public int UserId { get; set; }
    public int SubscriptionPlanId { get; set; }
    public string SubscriptionPlanName { get; set; } = string.Empty;
    public DateTime SubscriptionStartDate { get; set; }
    public DateTime? SubscriptionEndDate { get; set; }
    public string Status { get; set; } = string.Empty;
    public DateTime? NextBillingDate { get; set; }
    public string? StripeSubscriptionId { get; set; }
    public string? StripeCustomerId { get; set; }
}
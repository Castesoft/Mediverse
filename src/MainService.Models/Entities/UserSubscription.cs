namespace MainService.Models.Entities;

public class UserSubscription : BaseEntity
{
    public int UserId { get; set; }
    public AppUser User { get; set; } = null!;

    public int SubscriptionPlanId { get; set; }
    public SubscriptionPlan SubscriptionPlan { get; set; } = null!;

    public DateTime StartDate { get; set; }
    public DateTime? EndDate { get; set; }
    public SubscriptionStatus Status { get; set; }
    public DateTime? NextBillingDate { get; set; }

    public string? StripeSubscriptionId { get; set; }
    public string? StripeCustomerId { get; set; }

    public List<SubscriptionHistory> SubscriptionHistories { get; set; } = [];
    public List<SubscriptionCancellation> UserSubscriptionCancellations { get; set; } = [];
}
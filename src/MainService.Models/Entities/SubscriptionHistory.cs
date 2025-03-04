namespace MainService.Models.Entities;

public class SubscriptionHistory : BaseEntity
{
    public int UserSubscriptionId { get; set; }
    public UserSubscription UserSubscription { get; set; } = null!;
    public DateTime ChangedAt { get; set; } = DateTime.UtcNow;
    public SubscriptionStatus OldStatus { get; set; }
    public SubscriptionStatus NewStatus { get; set; }
    public string? Note { get; set; }
}
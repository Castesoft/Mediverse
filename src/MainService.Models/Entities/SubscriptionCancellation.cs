namespace MainService.Models.Entities;

public class SubscriptionCancellation : BaseEntity
{
    public DateTime CancellationDate { get; set; } = DateTime.UtcNow;

    public bool TooExpensive { get; set; }
    public bool NotEnoughUse { get; set; }
    public bool FoundAlternative { get; set; }
    public bool MissingFeatures { get; set; }
    public bool TechnicalProblems { get; set; }
    public bool PoorSupport { get; set; }
    public bool OtherReason { get; set; }
    public string? Feedback { get; set; }

    public int UserSubscriptionId { get; set; }
    public UserSubscription UserSubscription { get; set; }

    public int UserId { get; set; }
    public AppUser User { get; set; } = null!;
}
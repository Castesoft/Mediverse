namespace MainService.Core.DTOs.Subscriptions;

public class SubscriptionHistoryDto
{
    public int Id { get; set; }
    public int SubscriptionId { get; set; }
    public DateTime ChangedAt { get; set; }
    public string OldStatus { get; set; } = string.Empty;
    public string NewStatus { get; set; } = string.Empty;
    public string? Note { get; set; }
}
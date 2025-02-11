using MainService.Core.DTOs.Services;
using MainService.Core.DTOs.User;

namespace MainService.Core.DTOs.Events;

public class EventSummaryDto
{
    public int Id { get; set; }
    public bool? AllDay { get; set; }
    public DateTime CreatedAt { get; set; }
    public ServiceDto? Service { get; set; }
    public string PaymentStatus = string.Empty;
    public string? Evolution { get; set; }
    public string? NextSteps { get; set; }
    public DateTime? DateTo { get; set; }
    public DateTime? DateFrom { get; set; }
    public UserSummaryDto? Patient { get; set; }
}
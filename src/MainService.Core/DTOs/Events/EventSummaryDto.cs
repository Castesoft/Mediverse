using MainService.Core.DTOs.User;

namespace MainService.Core.DTOs.Events;

public class EventSummaryDto
{
    public int Id { get; set; }
    public bool AllDay { get; set; }
    public DateTime DateTo { get; set; }
    public DateTime DateFrom { get; set; }
    public UserSummaryDto Patient { get; set; }
}
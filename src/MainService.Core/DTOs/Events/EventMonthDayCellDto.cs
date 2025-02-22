namespace MainService.Core.DTOs.Events;

public class EventMonthDayCellDto
{
    public DateTime Date { get; set; }
    public List<EventSummaryDto> Events { get; set; } = [];
    public int TotalCount { get; set; }
}
using MainService.Models.Entities;

namespace MainService.Core.Helpers.Params;
public class EventParams : BaseParams
{
    public bool IsCalendarView { get; set; }
    public Roles Role { get; set; }
}
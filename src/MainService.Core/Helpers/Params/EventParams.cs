using MainService.Models.Entities;

namespace MainService.Core.Helpers.Params;
public class EventParams : BaseParams
{
    public int? PatientId { get; set; }
    public bool? IsCalendarView { get; set; }
    public Roles? Role { get; set; }
}
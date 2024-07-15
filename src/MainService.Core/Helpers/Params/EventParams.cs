using MainService.Models.Entities;

namespace MainService.Core.Helpers.Params;
public class EventParams : BaseParams
{
    public Roles Role { get; set; }
}
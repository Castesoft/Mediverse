using MainService.Models.Entities;

namespace MainService.Core.Helpers.Params;
public class UserParams : BaseParams
{
    public string Roles { get; set; }
    public Roles Role { get; set; }
}
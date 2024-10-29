#nullable enable

using MainService.Models.Entities;

namespace MainService.Core.Helpers.Params;
public class UserParams : BaseParams
{
    public string? Roles { get; set; } = null;
    public Roles Role { get; set; }
    public int? DoctorId { get; set; } = null;
}
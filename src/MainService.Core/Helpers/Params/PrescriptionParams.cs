using MainService.Models.Entities;

namespace MainService.Core.Helpers.Params;
public class PrescriptionParams : BaseCodeParams
{
    public int? EventId { get; set; }

    public List<string> Roles { get; set; } = [];
    public int? UserId { get; set; }
}
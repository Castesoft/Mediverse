using MainService.Models.Entities;

namespace MainService.Core.Helpers.Params;
public class PrescriptionParams : BaseCodeParams
{
    public int? EventId { get; set; }
}
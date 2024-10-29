#nullable enable

using MainService.Models.Entities;

namespace MainService.Core.Helpers.Params;
public class AddressParams : BaseParams
{
    public string? Types { get; set; } = null;
    public Addresses Type { get; set; }

    public int? DoctorId { get; set; } = null;
}
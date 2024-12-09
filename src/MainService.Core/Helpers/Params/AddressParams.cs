using MainService.Models.Entities.Addresses;

namespace MainService.Core.Helpers.Params;
public class AddressParams : BaseParams
{
    public string? Types { get; set; }
    public AddressesEnum? Type { get; set; }

    public int? DoctorId { get; set; }
}
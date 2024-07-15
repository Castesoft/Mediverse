using MainService.Models.Entities;

namespace MainService.Core.Helpers.Params;
public class AddressParams : BaseParams
{
    public string Types { get; set; }
    public Addresses Type { get; set; }
}
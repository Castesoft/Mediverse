using MainService.Models.Entities.Aggregate;

namespace MainService.Core.Helpers.Params;

public class ProductParams : BaseParams
{
    public bool? IsInternal { get; set; }
    public int? DoctorId { get; set; }
    public string? Barcode { get; set; }
    public string? Sku { get; set; }
    public int? Price { get; set; }
    public string? LotNumber { get; set; }
    public List<OptionDto>? Category { get; set; }
    public List<OptionDto>? Manufacturer { get; set; }
}
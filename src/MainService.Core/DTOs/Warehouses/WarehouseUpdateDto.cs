using MainService.Core.DTOs.WarehouseProduct;

namespace MainService.Core.DTOs.Warehouses;

public class WarehouseUpdateDto
{
    public int Id { get; set; }
    public int AddressId { get; set; }
    public List<WarehouseProductUpdateDto> WarehouseProducts { get; set; } = new();
}
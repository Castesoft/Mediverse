using MainService.Core.DTOs.Addresses;

namespace MainService.Core.DTOs.Warehouses;

public class WarehouseDto
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; }

    public AddressDto Address { get; set; } = null!;

    public List<WarehouseProductDto> WarehouseProducts { get; set; } = [];
}
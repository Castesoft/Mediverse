namespace MainService.Core.DTOs.WarehouseProduct;

public class ProductWarehouseUpdateDto
{
    public int ProductId { get; set; }
    public List<int> WarehouseIds { get; set; } = [];
}
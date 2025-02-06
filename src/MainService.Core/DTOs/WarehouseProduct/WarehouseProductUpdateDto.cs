namespace MainService.Core.DTOs.WarehouseProduct;

public class WarehouseProductUpdateDto
{
    public int ProductId { get; set; }
    public int Quantity { get; set; }
    public int ReservedQuantity { get; set; }
    public int DamagedQuantity { get; set; }
    public int OnHoldQuantity { get; set; }
    public int ReorderLevel { get; set; }
    public int SafetyStock { get; set; }
    public string? LotNumber { get; set; }
    public DateTime? ExpirationDate { get; set; }
}
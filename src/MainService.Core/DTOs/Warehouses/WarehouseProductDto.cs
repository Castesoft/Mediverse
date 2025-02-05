namespace MainService.Core.DTOs.Warehouses;

public class WarehouseProductDto
{
    public int WarehouseId { get; set; }
    public int ProductId { get; set; }
    public int Quantity { get; set; }
    public int ReservedQuantity { get; set; }
    public int DamagedQuantity { get; set; }
    public int OnHoldQuantity { get; set; }
    public int ReorderLevel { get; set; }
    public int SafetyStock { get; set; }
    public DateTime LastUpdated { get; set; }
    public string? LotNumber { get; set; }
    public DateTime? ExpirationDate { get; set; }
}
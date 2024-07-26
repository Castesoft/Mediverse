namespace MainService.Core.DTOs.Orders;

public class OrderItemDto
{
    public int? ItemId { get; set; }
    public int Quantity { get; set; }
    public string Dosage { get; set; }
    public string Instructions { get; set; }
    public string Notes { get; set; }
    public string Unit { get; set; }
    public string Name { get; set; }
    public string Description { get; set; }
    public decimal Price { get; set; }
    public double Discount { get; set; }
    public string Manufacturer { get; set; }
    public string LotNumber { get; set; }
    public DateTime CreatedAt { get; set; }
}
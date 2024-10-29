namespace MainService.Models.Entities;

public class OrderItem
{
    public int Quantity { get; set; }
    public double Dosage { get; set; }
    public string Instructions { get; set; }
    public string Notes { get; set; }
    public string Unit { get; set; }
    public decimal Price { get; set; }
    public double Discount { get; set; }

    public int OrderId { get; set; } public Order Order { get; set; }
    public int ItemId { get; set; } public Product Item { get; set; }
}
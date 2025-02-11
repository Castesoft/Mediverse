namespace MainService.Models.Entities;

public class OrderProduct
{
    public OrderProduct() {}
    public OrderProduct(Product item) => Product = item;
    public int? Quantity { get; set; }
    public double? Dosage { get; set; }
    public string? Instructions { get; set; }
    public string? Notes { get; set; }
    public string? Unit { get; set; }
    public decimal? Price { get; set; }
    public double? Discount { get; set; }

    public int OrderId { get; set; }
    public Order Order { get; set; } = null!;
    public int ProductId { get; set; }
    public Product Product { get; set; } = null!;
}
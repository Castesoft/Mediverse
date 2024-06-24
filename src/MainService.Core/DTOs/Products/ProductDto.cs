namespace MainService.Core.DTOs.Products;

public class ProductDto
{
    public int Id { get; set; }
    public string Name { get; set; }
    public string Description { get; set; }
    public decimal Price { get; set; }
    public double Discount { get; set; }
    public string Manufacturer { get; set; }
    public string LotNumber { get; set; }
    public string Unit { get; set; }
    public int Quantity { get; set; }
    public DateTime CreatedAt { get; set; }
}
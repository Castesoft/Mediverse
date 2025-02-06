namespace MainService.Core.DTOs.Products;

public class ProductSummaryDto
{
    public int Id { get; set; }
    public string? Name { get; set; }
    public bool? IsInternal { get; set; }
    public string? PhotoUrl { get; set; }
    public string? Description { get; set; }
    public decimal? Price { get; set; }
    public double? Discount { get; set; }
    public string? Manufacturer { get; set; }
    public string? LotNumber { get; set; }
    public string? Unit { get; set; }
    public string? SKU { get; set; }
    public string? Barcode { get; set; }
    public string? Category { get; set; }
    public List<string>? Tags { get; set; }
    public decimal? CostPrice { get; set; }
    public double? Dosage { get; set; }
    public int? Quantity { get; set; }
    public bool IsEnabled { get; set; }
    public bool IsVisible { get; set; }

    public ICollection<PhotoDto> Photos { get; set; } = [];
    public DateTime CreatedAt { get; set; }
}
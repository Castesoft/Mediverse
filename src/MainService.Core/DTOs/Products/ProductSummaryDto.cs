namespace MainService.Core.DTOs.Products;

public class ProductSummaryDto
{
    public int Id { get; set; }
    public bool IsInternal { get; set; }
    public string Name { get; set; }
    public string Description { get; set; }
    public string PhotoUrl { get; set; }
    public string Dosage { get; set; }
    public string Unit { get; set; }
}
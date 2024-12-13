namespace MainService.Core.DTOs.Services;

public class ServiceDto
{
    public int Id { get; set; }
    public string? Name { get; set; }
    public string? Description { get; set; }
    public decimal Price { get; set; }
    public double Discount { get; set; }
    public string? PhotoUrl { get; set; }
    public DateTime CreatedAt { get; set; }
}

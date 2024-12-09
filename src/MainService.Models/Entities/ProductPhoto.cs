namespace MainService.Models.Entities;
public class ProductPhoto
{
    public int ProductId { get; set; }
    public int PhotoId { get; set; }
    
    public Product Product { get; set; } = null!;
    public Photo Photo { get; set; } = null!;
}
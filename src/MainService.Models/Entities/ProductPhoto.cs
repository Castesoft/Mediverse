namespace MainService.Models.Entities;

public class ProductPhoto
{
    public ProductPhoto()
    {
    }
    
    public ProductPhoto(Photo photo) => Photo = photo;

    public ProductPhoto(Product product, Photo photo)
    {
        Product = product;
        Photo = photo;
    }

    public int ProductId { get; set; }
    public int PhotoId { get; set; }

    public Product Product { get; set; } = null!;
    public Photo Photo { get; set; } = null!;
    public bool IsMain { get; set; }
}
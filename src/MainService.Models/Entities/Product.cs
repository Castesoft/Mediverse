namespace MainService.Models.Entities;

public class Product : BaseEntity
{
    public Product()
    {
    }

    /// <summary>
    /// Initializes a new instance of the <see cref="Product"/> class.
    /// </summary>
    /// <param name="name">The name of the product.</param>
    /// <param name="description">The description of the product.</param>
    /// <remarks>
    /// This constructor is mainly used for development purposes.
    /// The price and discount of the product are randomized.
    /// </remarks>
    public Product(string? name, string? description)
    {
        Name = name;
        Description = description;
        Price = new Random().Next(100, 1000);
        Discount = new Random().NextDouble();
    }

    public Product(string? name, string? description, decimal? price, double? discount)
    {
        Name = name;
        Description = description;
        Price = price;
        Discount = discount;
    }

    public double? Dosage { get; set; }
    public string? Unit { get; set; }
    public string? Manufacturer { get; set; }
    public string? LotNumber { get; set; }
    public decimal? Price { get; set; }
    public double? Discount { get; set; }
    public bool IsEnabled { get; set; } = true;
    public bool IsVisible { get; set; } = true;
    public DoctorProduct DoctorProduct { get; set; } = null!;
    public List<ProductPhoto> ProductPhotos { get; set; } = [];
    public List<PrescriptionItem> PrescriptionItems { get; set; } = [];
    public List<OrderItem> OrderItems { get; set; } = [];

    public string GetPhotoUrl()
    {
        if (ProductPhotos.Count == 0) return "img/placeholder.png";
        var photo = ProductPhotos.First().Photo;
        return string.IsNullOrEmpty(photo.Url.AbsoluteUri) ? "img/placeholder.png" : photo.Url.AbsoluteUri;
    }
    
    public void SetMainPhoto()
    {
        if (ProductPhotos.Count <= 0) return;
        
        var mainPhoto = ProductPhotos.FirstOrDefault();
        if (mainPhoto == null) return;
        
        var photos = ProductPhotos.ToList();
        
        photos.Remove(mainPhoto);
        photos.Insert(0, mainPhoto);
        ProductPhotos = photos;
    }
}
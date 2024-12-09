namespace MainService.Models.Entities;

public class Product : BaseEntity
{
    public Product() {}

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

    public DoctorProduct DoctorProduct { get; set; } = null!;
    public List<ProductPhoto> ProductPhotos { get; set; } = [];
    public List<PrescriptionItem> PrescriptionItems { get; set; } = [];
    public List<OrderItem> OrderItems { get; set; } = [];

    public string GetPhotoUrl() {
        if (ProductPhotos.Count() > 0) {
            Photo photo = ProductPhotos.First().Photo;

            string? url = photo.Url;

            if (string.IsNullOrEmpty(url)) return "img/placeholder.png";
            else return url;
        }

        return "img/placeholder.png";
    }
}
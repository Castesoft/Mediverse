namespace MainService.Models.Entities;

public class Product : BaseEntity
{
    public string Name { get; set; }
    public string Description { get; set; }
    public int Quantity { get; set; }
    public string Unit { get; set; }
    public string Manufacturer { get; set; }
    public string LotNumber { get; set; }
    public decimal Price { get; set; }
    public double Discount { get; set; }

    public DoctorProduct DoctorProduct { get; set; }
    public ICollection<ProductPhoto> ProductPhotos { get; set; } = [];
    public ICollection<PrescriptionItem> PrescriptionItems { get; set; } = [];

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
    public Product(string name, string description)
    {
        Name = name;
        Description = description;
        Price = new Random().Next(100, 1000);
        Discount = new Random().NextDouble();
    }

    public Product(string name, string description, decimal price, double discount)
    {
        Name = name;
        Description = description;
        Price = price;
        Discount = discount;
    }
}
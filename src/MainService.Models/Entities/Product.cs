namespace MainService.Models.Entities
{
    public class Product : BaseEntity
    {
        public Product()
        {
        }

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
        public List<PrescriptionProduct> PrescriptionProducts { get; set; } = [];
        public List<OrderProduct> OrderItems { get; set; } = [];

        public List<WarehouseProduct> WarehouseProducts { get; set; } = [];

        // New properties for improved identification and categorization.
        public string SKU { get; set; } = string.Empty;
        public string Barcode { get; set; } = string.Empty;
        public string? Category { get; set; }

        // Optionally track the cost price.
        public decimal? CostPrice { get; set; }

        public string GetPhotoUrl()
        {
            if (ProductPhotos.Count == 0)
                return "img/placeholder.png";

            var photo = ProductPhotos.First().Photo;
            return string.IsNullOrEmpty(photo.Url.AbsoluteUri)
                ? "img/placeholder.png"
                : photo.Url.AbsoluteUri;
        }

        public void SetMainPhoto()
        {
            if (ProductPhotos.Count <= 0)
                return;

            var mainPhoto = ProductPhotos.FirstOrDefault();
            if (mainPhoto == null)
                return;

            var photos = ProductPhotos.ToList();
            photos.Remove(mainPhoto);
            photos.Insert(0, mainPhoto);
            ProductPhotos = photos;
        }
    }
}
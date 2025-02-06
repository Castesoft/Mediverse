namespace MainService.Models.Entities;

public class Service : BaseEntity
{
    public Service() { }

    public Service(int id) => Id = id;

    public Service(string? name, string? description)
    {
        Name = name;
        Description = description;
        Price = new Random().Next(100, 1000);
        Discount = new Random().NextDouble();
    }

    public Service(string name, string description, decimal price, double discount)
    {
        Name = name;
        Description = description;
        Price = price;
        Discount = discount;
    }

    public decimal? Price { get; set; }
    public double? Discount { get; set; }

    public DoctorService DoctorService { get; set; } = null!;
    public List<ServicePhoto> ServicePhotos { get; set; } = [];
    public List<EventService> EventServices { get; set; } = [];
    public List<SpecialtyService> SpecialtyServices { get; set; } = [];

    public string? GetPhotoUrl() {
        if (ServicePhotos != null &&
            ServicePhotos.Count > 0 &&
            ServicePhotos[0].Photo != null &&
            ServicePhotos[0].Photo.Url != null &&
            !string.IsNullOrEmpty(ServicePhotos[0].Photo.Url.AbsoluteUri))
        {
            return ServicePhotos[0].Photo.Url.AbsoluteUri;
        }

        return null;
    }
}

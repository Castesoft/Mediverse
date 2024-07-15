namespace MainService.Models.Entities;

public class Service : BaseEntity
{
    public string Name { get; set; }
    public string Description { get; set; }
    public decimal Price { get; set; }
    public double Discount { get; set; }

    public DoctorService DoctorService { get; set; }
    public ICollection<ServicePhoto> ServicePhotos { get; set; } = [];
    public ICollection<EventService> EventServices { get; set; } = [];

    public Service() {}
    
    public Service(int id) => Id = id;

    public Service(string name, string description)
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
}

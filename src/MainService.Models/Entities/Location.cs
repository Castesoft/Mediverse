namespace MainService.Models.Entities;

public class Location : BaseEntity
{
    public string ExteriorNumber { get; set; }
    public string InteriorNumber { get; set; }
    public string Street { get; set; }
    public string ZipCode { get; set; }
    public string City { get; set; }
    public string State { get; set; }
    public string Country { get; set; }
    public string Neighborhood { get; set; }
    public DoctorClinic DoctorClinic { get; set; }  
    public ICollection<NurseClinic> NurseClinics { get; set; } = [];
    public ICollection<LocationPhone> LocationPhones { get; set; } = [];
}
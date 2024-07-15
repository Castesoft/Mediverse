namespace MainService.Models.Entities;

public class Phone : BaseEntity
{
    public string PhoneNumber { get; set; }
    public string CountryCode { get; set; } = "+52";
    public string Extension { get; set; }
    public DoctorPhone DoctorPhone { get; set; }
}
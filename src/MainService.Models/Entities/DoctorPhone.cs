namespace MainService.Models.Entities;

public class DoctorPhone
{
    public int DoctorId { get; set; }
    public int PhoneId { get; set; }
    public AppUser Doctor { get; set; }
    public Phone Phone { get; set; }
}
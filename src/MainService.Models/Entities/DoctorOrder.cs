namespace MainService.Models.Entities;

public class DoctorOrder
{
    public int DoctorId { get; set; }
    public int OrderId { get; set; }
    public AppUser Doctor { get; set; }
    public Order Order { get; set; }
}
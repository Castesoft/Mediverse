namespace MainService.Models.Entities;

public class DoctorOrder
{
    public DoctorOrder() {}
    public DoctorOrder(int doctorId) => DoctorId = doctorId;
    public DoctorOrder(AppUser doctor, Order order)
    {
        Doctor = doctor;
        Order = order;
    }
    public int DoctorId { get; set; }
    public int OrderId { get; set; }
    public AppUser Doctor { get; set; } = null!;
    public Order Order { get; set; } = null!;
}
namespace MainService.Models.Entities;

public class PatientOrder
{
    public int PatientId { get; set; }
    public int OrderId { get; set; }
    public AppUser Patient { get; set; }
    public Order Order { get; set; }
}
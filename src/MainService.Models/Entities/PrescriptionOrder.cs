namespace MainService.Models.Entities;

public class PrescriptionOrder
{
    public int PrescriptionId { get; set; }
    public int OrderId { get; set; }
    public Prescription Prescription { get; set; }
    public Order Order { get; set; }
}
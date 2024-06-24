namespace MainService.Models.Entities;

public class PrescriptionLogo
{
    public int PrescriptionId { get; set; }
    public int PhotoId { get; set; }
    public Prescription Prescription { get; set; }
    public Photo Photo { get; set; }
}
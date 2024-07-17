namespace MainService.Models.Entities;

public class PatientPrescription
{
    public AppUser Patient { get; set; }
    public int PatientId { get; set; }
    public Prescription Prescription { get; set; }
    public int PrescriptionId { get; set; }
}
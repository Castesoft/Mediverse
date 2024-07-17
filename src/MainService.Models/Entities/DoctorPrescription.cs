namespace MainService.Models.Entities;

public class DoctorPrescription
{
    public AppUser Doctor { get; set; }
    public int DoctorId { get; set; }
    public Prescription Prescription { get; set; }
    public int PrescriptionId { get; set; }
}
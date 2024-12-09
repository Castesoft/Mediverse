namespace MainService.Models.Entities;

public class DoctorPrescription
{
    public DoctorPrescription() { }
    public DoctorPrescription(int doctorId) => DoctorId = doctorId;
    
    public AppUser Doctor { get; set; } = null!;
    public int DoctorId { get; set; }
    public Prescription Prescription { get; set; } = null!;
    public int PrescriptionId { get; set; }
}
namespace MainService.Models.Entities;

public class DoctorPrescription
{
    public DoctorPrescription() { }
    public DoctorPrescription(int doctorId) => DoctorId = doctorId;
    
    public AppUser Doctor { get; set; }
    public int DoctorId { get; set; }
    public Prescription Prescription { get; set; }
    public int PrescriptionId { get; set; }
}
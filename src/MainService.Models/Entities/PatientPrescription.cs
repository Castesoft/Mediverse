namespace MainService.Models.Entities;

public class PatientPrescription
{
    public PatientPrescription() {}
    public PatientPrescription(int patientId) => PatientId = patientId;
    
    public AppUser Patient { get; set; } = null!;
    public int PatientId { get; set; }
    public Prescription Prescription { get; set; } = null!;
    public int PrescriptionId { get; set; }
}
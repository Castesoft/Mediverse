namespace MainService.Models.Entities;
public class Prescription : BaseEntity
{
    // Properties
    public string PatientFullName { get; set; }
    public DateTime PatientDateOfBirth { get; set; }
    public int PatientAge { get; set; }
    public string DoctorAddress { get; set; }

    // Navigation Properties
    public AppUser Patient { get; set; }
    public AppUser Doctor { get; set; } 
    public EventPrescription EventPrescription { get; set; }
    public ICollection<PrescriptionMedicine> PrescriptionMedicines { get; set; } = [];
    public PrescriptionLogo PrescriptionLogo { get; set; }
}
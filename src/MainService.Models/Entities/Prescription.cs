namespace MainService.Models.Entities;
public class Prescription : BaseEntity
{
    public int ExchangeAmount { get; set; }
    
    // Navigation Properties
    public PatientPrescription PatientPrescription { get; set; }
    public DoctorPrescription DoctorPrescription { get; set; } 
    public EventPrescription EventPrescription { get; set; }
    public ICollection<PrescriptionItem> PrescriptionItems { get; set; } = [];
}
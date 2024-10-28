namespace MainService.Models.Entities;
public class Prescription : BaseEntity
{
    public int ExchangeAmount { get; set; }
    public string Notes { get; set; }
    
    // Navigation Properties
    public PatientPrescription PatientPrescription { get; set; }
    public DoctorPrescription DoctorPrescription { get; set; } 
    public EventPrescription EventPrescription { get; set; }
    public List<PrescriptionItem> PrescriptionItems { get; set; } = [];
    public PrescriptionOrder PrescriptionOrder { get; set; }
}
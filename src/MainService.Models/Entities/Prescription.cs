namespace MainService.Models.Entities;
public class Prescription : BaseEntity
{
    public int? ExchangeAmount { get; set; }
    public string? Notes { get; set; }
    
    // Navigation Properties
    public PatientPrescription PatientPrescription { get; set; } = null!;
    public DoctorPrescription DoctorPrescription { get; set; } = null!;
    public EventPrescription EventPrescription { get; set; } = null!;
    public List<PrescriptionItem> PrescriptionItems { get; set; } = [];
    public PrescriptionOrder PrescriptionOrder { get; set; } = null!;
    public PrescriptionClinic PrescriptionClinic { get; set; } = null!;
}
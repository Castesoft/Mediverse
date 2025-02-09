namespace MainService.Models.Entities;
public class Prescription : BaseEntity
{
    public DateTime? Date { get; set; }
    public int? ExchangeAmount { get; set; }
    public string? Notes { get; set; }
    
    // Navigation Properties
    public PatientPrescription PatientPrescription { get; set; } = null!;
    public DoctorPrescription DoctorPrescription { get; set; } = null!;
    public EventPrescription EventPrescription { get; set; } = null!;
    public List<PrescriptionProduct> PrescriptionItems { get; set; } = [];
    public PrescriptionOrder PrescriptionOrder { get; set; } = null!;
    public PrescriptionClinic PrescriptionClinic { get; set; } = null!;

    public string? GetPhotoUrl() {
        if (PrescriptionClinic != null &&
            PrescriptionClinic.Clinic != null &&
            PrescriptionClinic.Clinic.ClinicLogo != null &&
            PrescriptionClinic.Clinic.ClinicLogo.Photo != null &&
            PrescriptionClinic.Clinic.ClinicLogo.Photo.Url != null &&
            !string.IsNullOrEmpty(PrescriptionClinic.Clinic.ClinicLogo.Photo.Url.AbsoluteUri)
        )
        {
            return PrescriptionClinic.Clinic.ClinicLogo.Photo.Url.AbsoluteUri;
        }

        return null;
    }
}
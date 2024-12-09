namespace MainService.Models.Entities;
public class DoctorPatient
{
    public int DoctorId { get; set; }
    public int PatientId { get; set; }

    public AppUser Doctor { get; set; } = null!;
    public AppUser Patient { get; set; } = null!;

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public bool HasPatientInformationAccess { get; set; } = false;

    public DoctorPatient() {}

    public DoctorPatient(int doctorId) => DoctorId = doctorId;
    public DoctorPatient(int doctorId, int patientId) : this(doctorId) => PatientId = patientId;
}
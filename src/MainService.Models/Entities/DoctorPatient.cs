namespace MainService.Models.Entities;

public class DoctorPatient
{
    public DoctorPatient()
    {
    }

    public DoctorPatient(int doctorId) => DoctorId = doctorId;

    public DoctorPatient(int doctorId, int patientId) : this(doctorId)
    {
        PatientId = patientId;
    }

    public int DoctorId { get; set; }

    public int PatientId { get; set; }
    public AppUser Doctor { get; set; } = null!;

    public AppUser Patient { get; set; } = null!;

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    /// <summary>
    /// Indicates whether the patient has granted the doctor access to their clinical history.
    /// </summary>
    public bool HasClinicalHistoryAccess { get; set; } = false;

    /// <summary>
    /// Optionally, the date and time when consent was granted.
    /// </summary>
    public DateTime? ConsentGrantedAt { get; set; }
}
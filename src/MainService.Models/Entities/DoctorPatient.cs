namespace MainService.Models.Entities;
public class DoctorPatient
{
    public int DoctorId { get; set; }
    public int PatientId { get; set; }

    public AppUser Doctor { get; set; }
    public AppUser Patient { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public DoctorPatient() {}
}
namespace MainService.Core.DTOs.User
{
    public class DoctorPatientDto
    {
        public int DoctorId { get; set; }
        public int PatientId { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public bool HasPatientInformationAccess { get; set; } = false;
    }
}
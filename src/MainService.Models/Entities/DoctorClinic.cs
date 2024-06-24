namespace MainService.Models.Entities;

public class DoctorClinic
{
    public int DoctorId { get; set; }
    public int ClinicId { get; set; }
    public AppUser Doctor { get; set; }
    public Location Clinic { get; set; }
}
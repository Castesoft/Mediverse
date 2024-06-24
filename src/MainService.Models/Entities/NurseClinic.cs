namespace MainService.Models.Entities;

public class NurseClinic
{
    public int NurseId { get; set; }
    public int ClinicId { get; set; }
    public AppUser Nurse { get; set; }
    public Location Clinic { get; set; }
}
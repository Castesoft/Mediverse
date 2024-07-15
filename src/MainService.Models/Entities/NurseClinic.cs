namespace MainService.Models.Entities;

public class ClinicNurse
{
    public int ClinicId { get; set; }
    public int NurseId { get; set; }
    public Address Clinic { get; set; }
    public AppUser Nurse { get; set; }
}
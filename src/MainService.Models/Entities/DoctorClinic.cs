namespace MainService.Models.Entities;

public class DoctorClinic
{
    public int DoctorId { get; set; }
    public int ClinicId { get; set; }
    public AppUser Doctor { get; set; } = null!;
    public Address Clinic { get; set; } = null!;

    public bool? IsMain { get; set; }

    public DoctorClinic() {}
    public DoctorClinic(Address clinic) => Clinic = clinic;

    public DoctorClinic(Address clinic, bool isMain)
    {
        Clinic = clinic;
        IsMain = isMain;
    }
}
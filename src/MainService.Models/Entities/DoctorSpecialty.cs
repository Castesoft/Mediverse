namespace MainService.Models.Entities;

public class DoctorSpecialty
{
    public DoctorSpecialty() { }
    public DoctorSpecialty(AppUser doctor, Specialty specialty)
    {
        Doctor = doctor;
        Specialty = specialty;
    }
    public DoctorSpecialty(Specialty specialty) => Specialty = specialty;
    public int DoctorId { get; set; }
    public int SpecialtyId { get; set; }
    public AppUser Doctor { get; set; } = null!;
    public Specialty Specialty { get; set; } = null!;
}
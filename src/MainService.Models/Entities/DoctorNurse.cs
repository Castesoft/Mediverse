namespace MainService.Models.Entities;
public class DoctorNurse
{
    public int DoctorId { get; set; }
    public AppUser Doctor { get; set; } = null!;
    public int NurseId { get; set; }
    public AppUser Nurse { get; set; } = null!;
    
    public DoctorNurse() {}
    
    public DoctorNurse(AppUser doctor, AppUser nurse)
    {
        Doctor = doctor;
        Nurse = nurse;
    }

    public DoctorNurse(int doctorId, int nurseId)
    {
        DoctorId = doctorId;
        NurseId = nurseId;
    }
}
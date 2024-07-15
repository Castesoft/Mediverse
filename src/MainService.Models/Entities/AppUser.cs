using Microsoft.AspNetCore.Identity;

namespace MainService.Models.Entities;
public class AppUser : IdentityUser<int>
{
    public string FirstName { get; set; }
    public string LastName { get; set; }
    public string Sex { get; set; }
    public DateOnly DateOfBirth { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime LastActive { get; set; } = DateTime.UtcNow;
    
    public string PhoneNumberCountryCode { get; set; } = "+52";
    public byte[] EmailVerificationCodeHash { get; set; }
    public byte[] EmailVerificationCodeSalt { get; set; }
    public DateTime? EmailVerificationExpiryTime { get; set; }
    public byte[] PhoneNumberVerificationCodeHash { get; set; }
    public byte[] PhoneNumberVerificationCodeSalt { get; set; }
    public DateTime? PhoneNumberVerificationExpiryTime { get; set; }

    // Base account properties
    public ICollection<UserAddress> UserAddresses { get; set; } = [];
    public UserPhoto UserPhoto { get; set; }
    public ICollection<AppUserRole> UserRoles { get; set; } = [];
    public ICollection<AppUserPermission> UserPermissions { get; set; } = [];


    // Nurse properties
    public string Education { get; set; }
    public string Post { get; set; }
    public ICollection<ClinicNurse> ClinicNurses { get; set; } = [];
    

    // Navigation properties
    public List<DoctorService> DoctorServices { get; set; } = [];

    public List<DoctorNurse> DoctorNurses { get; set; } = [];
    public List<DoctorNurse> NursesDoctor { get; set; } = [];
    
    public DoctorSignature DoctorSignature { get; set; }
    public DoctorInformation DoctorInformation { get; set; }
    public ICollection<PatientEvent> PatientEvents { get; set; } = [];

    // Doctor-Patient relationships
    public ICollection<DoctorPatient> Doctors { get; set; } = [];
    public ICollection<DoctorPatient> Patients { get; set; } = [];
    public ICollection<DoctorEvent> DoctorEvents { get; set; } = [];
    public ICollection<DoctorPhone> DoctorPhones { get; set; } = [];
    public ICollection<DoctorLink> DoctorLinks { get; set; } = [];
    public ICollection<DoctorClinic> DoctorClinics { get; set; } = [];
}
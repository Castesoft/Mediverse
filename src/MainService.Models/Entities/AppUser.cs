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

    // Navigation properties
    public UserPhoto UserPhoto { get; set; }
    public DoctorSignature DoctorSignature { get; set; }
    public DoctorInformation DoctorInformation { get; set; }
    public ICollection<PatientAppointment> PatientAppointments { get; set; } = [];
    public ICollection<DoctorAppointment> DoctorAppointments { get; set; } = [];
    public ICollection<AppUserRole> UserRoles { get; set; } = [];
    public ICollection<AppUserPermission> UserPermissions { get; set; } = [];
    public ICollection<DoctorPhone> DoctorPhones { get; set; } = [];
    public ICollection<DoctorLink> DoctorLinks { get; set; } = [];
    public ICollection<DoctorClinic> DoctorClinics { get; set; } = [];
    public NurseClinic NurseClinic { get; set; }
}
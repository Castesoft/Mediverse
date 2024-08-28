using Microsoft.AspNetCore.Identity;

namespace MainService.Models.Entities;
public class AppUser : IdentityUser<int>
{
    // Constructors

    public AppUser(){}
    
    public AppUser(int id) => Id = id;
    public AppUser(IEnumerable<int> ids)
        {}

    // Properties
    
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
    public string StripeCustomerId { get; set; }
    public string RecommendedBy { get; set; }

    // Base account properties

    public ICollection<UserAddress> UserAddresses { get; set; } = [];
    public UserPhoto UserPhoto { get; set; }
    public DoctorBannerPhoto DoctorBannerPhoto { get; set; }
    public ICollection<AppUserRole> UserRoles { get; set; } = [];
    public ICollection<AppUserPermission> UserPermissions { get; set; } = [];
    public ICollection<UserMedicalInsuranceCompany> UserMedicalInsuranceCompanies { get; set; } = [];

    // User Billing Information Properties
    public ICollection<UserPaymentMethod> UserPaymentMethods { get; set; } = [];
    public string RFC { get; set; }
    public string CURP { get; set; }
    public string CommercialName { get; set; }
    public string LegalName { get; set; }
    public ICollection<UserTaxRegime> UserTaxRegimes { get; set; } = [];

    // Medical Properties
    public string Education { get; set; }
    public string Post { get; set; }
    public ICollection<ClinicNurse> ClinicNurses { get; set; } = [];
    public ICollection<NurseEvent> NurseEvents { get; set; } = [];
    public ICollection<UserMedicalLicense> UserMedicalLicenses { get; set; } = [];
    public List<DoctorPaymentMethodType> DoctorPaymentMethodTypes { get; set; } = [];
    public string StripeConnectAccountId { get; set; }
    public bool RequireAnticipatedCardPayments { get; set; }
    public ICollection<DoctorMedicalInsuranceCompany> DoctorMedicalInsuranceCompanies { get; set; } = [];
    public ICollection<DoctorWorkSchedule> DoctorWorkSchedules { get; set; } = [];

    // Navigation properties
    public List<DoctorService> DoctorServices { get; set; } = [];
    public List<DoctorProduct> DoctorProducts { get; set; } = [];

    public List<DoctorNurse> DoctorNurses { get; set; } = [];
    public List<DoctorNurse> NursesDoctor { get; set; } = [];
    
    public DoctorSignature DoctorSignature { get; set; }
    public ICollection<PatientEvent> PatientEvents { get; set; } = [];
    public ICollection<PatientPrescription> PatientPrescriptions { get; set; } = [];
    public ICollection<DoctorPrescription> DoctorPrescriptions { get; set; } = [];
    public ICollection<PatientOrder> PatientOrders { get; set; } = [];
    public ICollection<DoctorOrder> DoctorOrders { get; set; } = [];

    // Doctor-Patient relationships
    public ICollection<DoctorPatient> Doctors { get; set; } = [];
    public ICollection<DoctorPatient> Patients { get; set; } = [];
    public ICollection<DoctorEvent> DoctorEvents { get; set; } = [];
    public ICollection<DoctorPhone> DoctorPhones { get; set; } = [];
    public ICollection<DoctorLink> DoctorLinks { get; set; } = [];
    public ICollection<DoctorClinic> DoctorClinics { get; set; } = [];
}
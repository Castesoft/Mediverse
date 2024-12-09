using MainService.Models.Entities.Aggregate;
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
    
    public string? FirstName { get; set; }
    public string? LastName { get; set; }
    public string? Sex { get; set; }
    public DateOnly? DateOfBirth { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime LastActive { get; set; } = DateTime.UtcNow;
    
    public string? PhoneNumberCountryCode { get; set; } = "+52";
    public byte[]? EmailVerificationCodeHash { get; set; }
    public byte[]? EmailVerificationCodeSalt { get; set; }
    public DateTime? EmailVerificationExpiryTime { get; set; }
    public byte[]? PhoneNumberVerificationCodeHash { get; set; }
    public byte[]? PhoneNumberVerificationCodeSalt { get; set; }
    public DateTime? PhoneNumberVerificationExpiryTime { get; set; }
    public string? StripeCustomerId { get; set; }
    public string? RecommendedBy { get; set; }

    // Base account properties
    public List<UserAddress> UserAddresses { get; set; } = [];
    public UserPhoto UserPhoto { get; set; } = null!;
    public DoctorBannerPhoto DoctorBannerPhoto { get; set; } = null!;
    public List<AppUserRole> UserRoles { get; set; } = [];
    public List<AppUserPermission> UserPermissions { get; set; } = [];
    public List<UserMedicalInsuranceCompany> UserMedicalInsuranceCompanies { get; set; } = [];
    public List<UserReview> UserReviews { get; set; } = [];
    public UserMedicalRecord UserMedicalRecord { get; set; } = null!;

    // User Billing Information Properties
    public List<UserPaymentMethod> UserPaymentMethods { get; set; } = [];
    public string? RFC { get; set; }
    public string? CURP { get; set; }
    public string? CommercialName { get; set; }
    public string? LegalName { get; set; }
    public List<UserTaxRegime> UserTaxRegimes { get; set; } = [];

    // Medical Properties
    public string? Education { get; set; }
    public string? Post { get; set; }
    public List<ClinicNurse> ClinicNurses { get; set; } = [];
    public List<NurseEvent> NurseEvents { get; set; } = [];
    public List<UserMedicalLicense> UserMedicalLicenses { get; set; } = [];
    public List<DoctorPaymentMethodType> DoctorPaymentMethodTypes { get; set; } = [];
    public string? StripeConnectAccountId { get; set; }
    public bool? RequireAnticipatedCardPayments { get; set; }
    public List<DoctorMedicalInsuranceCompany> DoctorMedicalInsuranceCompanies { get; set; } = [];
    public List<DoctorWorkSchedule> DoctorWorkSchedules { get; set; } = [];
    public DoctorWorkScheduleSettings DoctorWorkScheduleSettings { get; set; } = null!;
    public List<DoctorReview> DoctorReviews { get; set; } = [];

    // Navigation properties
    public List<DoctorService> DoctorServices { get; set; } = [];
    public List<DoctorProduct> DoctorProducts { get; set; } = [];

    public List<DoctorNurse> DoctorNurses { get; set; } = [];
    public List<DoctorNurse> NursesDoctor { get; set; } = [];
    
    public DoctorSignature DoctorSignature { get; set; } = null!;
    public List<PatientEvent> PatientEvents { get; set; } = [];
    public List<PatientPrescription> PatientPrescriptions { get; set; } = [];
    public List<DoctorPrescription> DoctorPrescriptions { get; set; } = [];
    public List<PatientOrder> PatientOrders { get; set; } = [];
    public List<DoctorOrder> DoctorOrders { get; set; } = [];

    // Doctor-Patient relationships
    public List<DoctorPatient> Doctors { get; set; } = [];
    public List<DoctorPatient> Patients { get; set; } = [];
    public List<DoctorEvent> DoctorEvents { get; set; } = [];
    public List<DoctorPhone> DoctorPhones { get; set; } = [];
    public List<DoctorLink> DoctorLinks { get; set; } = [];
    public List<DoctorClinic> DoctorClinics { get; set; } = [];

    public OptionDto GetSex() =>
            Sex switch
            {
                "Masculino" => new(1, "Masculino", "Masculino"),
                "Femenino" => new(2, "Femenino", "Hembra"),
                _ => new(3, "unknown", "Desconocido"),
            };
}
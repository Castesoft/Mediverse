using MainService.Core.DTOs.Events;
using MainService.Models.Entities;

namespace MainService.Core.DTOs.User;
public class UserDto : BaseUserDto
{
    public bool IsEmailVerified { get; set; }
    public string PhoneNumberCountryCode { get; set; }
    public bool IsPhoneNumberVerified { get; set; }
    public bool HasAccount { get; set; }

    // RFC
    public string TaxId { get; set; }

    public List<RoleDto> Roles { get; set; } = [];
    public List<PermissionDto> Permissions { get; set; } = [];

    public string Education { get; set; }
    public string Post { get; set; }

    public string Street { get; set; }
    public string InteriorNumber { get; set; }
    public string ExteriorNumber { get; set; }
    public string Neighborhood { get; set; }
    public string City { get; set; }
    public string State { get; set; }
    public string Country { get; set; }
    public string Zipcode { get; set; }

    public List<EventDto> DoctorEvents { get; set; } = [];
    public List<PaymentDto> DoctorPayments { get; set; } = [];
    public List<UserMedicalInsuranceCompanyDto> MedicalInsuranceCompanies { get; set; } = [];
    public List<DoctorPatientDto> SharedDoctors { get; set; } = [];
    public bool HasPatientInformationAccess { get; set; }
}
#nullable enable

namespace MainService.Models.Entities
{
    public class MedicalInsuranceCompany : BaseEntity
    {
        public MedicalInsuranceCompanyPhoto MedicalInsuranceCompanyPhoto { get; set; } = null!;
        public List<UserMedicalInsuranceCompany> UserMedicalInsuranceCompanies { get; set; } = [];
        public List<DoctorMedicalInsuranceCompany> DoctorMedicalInsuranceCompanies { get; set; } = [];
        public List<EventMedicalInsuranceCompany> EventMedicalInsuranceCompanies { get; set; } = [];

        public string? GetPhotoUrl() => MedicalInsuranceCompanyPhoto?.Photo?.Url ?? null;
    }
}

#nullable disable
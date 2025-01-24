

using MainService.Models.Entities.Aggregate;

namespace MainService.Models.Entities
{
    public class MedicalInsuranceCompany : BaseCodeEntity
    {
        public MedicalInsuranceCompanyPhoto MedicalInsuranceCompanyPhoto { get; set; } = null!;
        public List<UserMedicalInsuranceCompany> UserMedicalInsuranceCompanies { get; set; } = [];
        public List<DoctorMedicalInsuranceCompany> DoctorMedicalInsuranceCompanies { get; set; } = [];
        public List<EventMedicalInsuranceCompany> EventMedicalInsuranceCompanies { get; set; } = [];

        public string? GetPhotoUrl() => MedicalInsuranceCompanyPhoto?.Photo?.Url.AbsoluteUri ?? null;
    }

    public class MedicalInsuranceCompanyDto : BaseCodeEntity {}
    public class MedicalInsuranceCompanyParams : BaseCodeParams {}
    public class MedicalInsuranceCompanyCreateDto : BaseCodeManageDto {}
    public class MedicalInsuranceCompanyUpdateDto : BaseCodeManageDto {}
}


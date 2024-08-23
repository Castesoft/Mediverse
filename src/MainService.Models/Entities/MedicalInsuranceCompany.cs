namespace MainService.Models.Entities
{
    public class MedicalInsuranceCompany : BaseEntity
    {
        public MedicalInsuranceCompanyPhoto MedicalInsuranceCompanyPhoto { get; set; }
        public ICollection<UserMedicalInsuranceCompany> UserMedicalInsuranceCompanies { get; set; } = [];
        public ICollection<DoctorMedicalInsuranceCompany> DoctorMedicalInsuranceCompanies { get; set; } = [];
        public ICollection<EventMedicalInsuranceCompany> EventMedicalInsuranceCompanies { get; set; } = [];
    }
}
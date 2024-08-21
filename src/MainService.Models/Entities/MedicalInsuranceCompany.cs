namespace MainService.Models.Entities
{
    public class MedicalInsuranceCompany : BaseEntity
    {
        public MedicalInsuranceCompanyPhoto MedicalInsuranceCompanyPhoto { get; set; }
        public ICollection<UserMedicalInsuranceCompany> UserMedicalInsuranceCompanies { get; set; } = [];
    }
}
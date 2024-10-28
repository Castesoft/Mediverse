using MainService.Models.Entities.Aggregate;

namespace MainService.Core.DTOs.User
{
    public class UserMedicalInsuranceCompanyDto
    {
        public int Id { get; set; }
        public bool IsMain { get; set; }
        public string PolicyNumber { get; set; }
        public OptionDto MedicalInsuranceCompany { get; set; }
        public DocumentDto Document { get; set; }
    }
}
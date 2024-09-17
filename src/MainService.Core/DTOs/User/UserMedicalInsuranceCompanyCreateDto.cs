namespace MainService.Core.DTOs.User
{
    public class UserMedicalInsuranceCompanyCreateDto
    {
        public string MedicalInsuranceCompanyId { get; set; }
        public bool IsMain { get; set; }
        public string PolicyNumber { get; set; }
        
    }
}
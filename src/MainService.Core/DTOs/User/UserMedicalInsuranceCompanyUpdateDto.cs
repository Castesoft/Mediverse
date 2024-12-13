namespace MainService.Core.DTOs.User
{
    public class UserMedicalInsuranceCompanyUpdateDto
    {
        public int MedicalInsuranceCompanyId { get; set; }
        public bool IsMain { get; set; }
        public string? PolicyNumber { get; set; }
        
    }
}
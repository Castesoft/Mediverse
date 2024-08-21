namespace MainService.Models.Entities
{
    public class UserMedicalInsuranceCompany
    {
        public int UserId { get; set; }
        public int MedicalInsuranceCompanyId { get; set; }
        public AppUser User { get; set; }
        public MedicalInsuranceCompany MedicalInsuranceCompany { get; set; }

        public bool IsMain { get; set; }
        public string PolicyNumber { get; set; }
    }
}
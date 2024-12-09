namespace MainService.Models.Entities
{
    public class UserMedicalInsuranceCompany
    {
        public int UserId { get; set; }
        public AppUser User { get; set; } = null!;
        public int MedicalInsuranceCompanyId { get; set; }
        public MedicalInsuranceCompany MedicalInsuranceCompany { get; set; } = null!;

        public int? DocumentId { get; set; }
        public Document? Document { get; set; }

        public bool IsMain { get; set; } = false;
        public string? PolicyNumber { get; set; }
    }
}
namespace MainService.Models.Entities
{
    public class DoctorMedicalInsuranceCompany
    {
        public int UserId { get; set; }
        public int MedicalInsuranceCompanyId { get; set; }
        public AppUser User { get; set; }
        public MedicalInsuranceCompany MedicalInsuranceCompany { get; set; }
    }
}
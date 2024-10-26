namespace MainService.Models.Entities
{
    public class DoctorMedicalInsuranceCompany
    {
        public int DoctorId { get; set; }
        public int MedicalInsuranceCompanyId { get; set; }
        public AppUser Doctor { get; set; }
        public MedicalInsuranceCompany MedicalInsuranceCompany { get; set; }
    }
}
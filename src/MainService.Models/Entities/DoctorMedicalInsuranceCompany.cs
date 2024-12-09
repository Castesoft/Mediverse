namespace MainService.Models.Entities
{
    public class DoctorMedicalInsuranceCompany
    {
        public DoctorMedicalInsuranceCompany() {}
        public DoctorMedicalInsuranceCompany(int medicalInsuranceCompanyId) => MedicalInsuranceCompanyId = medicalInsuranceCompanyId;
        public DoctorMedicalInsuranceCompany(int doctorId, int medicalInsuranceCompanyId)
        {
            DoctorId = doctorId;
            MedicalInsuranceCompanyId = medicalInsuranceCompanyId;
        }
        
        public int DoctorId { get; set; }
        public int MedicalInsuranceCompanyId { get; set; }
        public AppUser Doctor { get; set; } = null!;
        public MedicalInsuranceCompany MedicalInsuranceCompany { get; set; } = null!;
    }
}
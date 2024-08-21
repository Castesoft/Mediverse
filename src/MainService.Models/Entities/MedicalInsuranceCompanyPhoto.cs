namespace MainService.Models.Entities
{
    public class MedicalInsuranceCompanyPhoto
    {
        public MedicalInsuranceCompany MedicalInsuranceCompany { get; set; }
        public Photo Photo { get; set; }
        public int MedicalInsuranceCompanyId { get; set; }
        public int PhotoId { get; set; }
    }
}
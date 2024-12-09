namespace MainService.Models.Entities
{
    public class MedicalInsuranceCompanyPhoto
    {
        public MedicalInsuranceCompany MedicalInsuranceCompany { get; set; } = null!;
        public Photo Photo { get; set; } = null!;
        public int MedicalInsuranceCompanyId { get; set; }
        public int PhotoId { get; set; }
    }
}
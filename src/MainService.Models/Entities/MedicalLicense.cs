namespace MainService.Models.Entities;

public class MedicalLicense : BaseEntity
{
    public string LicenseNumber { get; set; }
    public string SpecialtyLicense { get; set; }
    public MedicalProfessionalLicense MedicalProfessionalLicense { get; set; }
}
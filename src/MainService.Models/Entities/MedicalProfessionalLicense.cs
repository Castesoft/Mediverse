namespace MainService.Models.Entities;

public class MedicalProfessionalLicense 
{
    public int SpecialistSpecificationId { get; set; }
    public int MedicalLicenseId { get; set; }
    public SpecialistSpecification SpecialistSpecification { get; set; }
    public MedicalLicense MedicalLicense { get; set; }
}
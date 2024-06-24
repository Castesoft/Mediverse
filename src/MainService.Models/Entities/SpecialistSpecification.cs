namespace MainService.Models.Entities;

public class SpecialistSpecification : BaseEntity
{
    public ICollection<MedicalProfessionalLicense> MedicalProfessionalLicenses { get; set; } = [];
    public DoctorInformation DoctorInformation { get; set; }
}
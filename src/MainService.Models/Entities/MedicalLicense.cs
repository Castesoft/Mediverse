namespace MainService.Models.Entities;

public class MedicalLicense : BaseEntity
{
    public MedicalLicense() {}
    public MedicalLicense(int specialtyId) => MedicalLicenseSpecialty = new (specialtyId);
    public MedicalLicense(int specialtyId, string documentPublicId, string documentUrl) {
        MedicalLicenseSpecialty = new (specialtyId);
        MedicalLicenseDocument = new (documentPublicId, documentUrl);
    }

    public string LicenseNumber { get; set; }
    public string SpecialtyLicense { get; set; }

    public MedicalLicenseDocument MedicalLicenseDocument { get; set; }
    public MedicalLicenseSpecialty MedicalLicenseSpecialty { get; set; }
    public ICollection<MedicalLicenseSubSpecialty> MedicalLicenseSubSpecialties { get; set; } = [];
}
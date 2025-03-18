namespace MainService.Models.Entities;
public class MedicalLicenseSpecialty
{
    public MedicalLicenseSpecialty() {}
    public MedicalLicenseSpecialty(int specialtyId) => SpecialtyId = specialtyId;
    public MedicalLicenseSpecialty(int medicalLicenseId, int specialtyId)
    {
        MedicalLicenseId = medicalLicenseId;
        SpecialtyId = specialtyId;
    }

    public MedicalLicenseSpecialty(Specialty specialty) => Specialty = specialty;
    public MedicalLicenseSpecialty(MedicalLicense medicalLicense) => MedicalLicense = medicalLicense;
    
    public int MedicalLicenseId { get; set; }
    public int SpecialtyId { get; set; }
    public MedicalLicense MedicalLicense { get; set; } = null!;
    public Specialty Specialty { get; set; } = null!;
}
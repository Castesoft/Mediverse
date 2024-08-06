namespace MainService.Models.Entities;
public class MedicalLicenseDocument
{
    public MedicalLicense MedicalLicense { get; set; }
    public Document Document { get; set; }
    public int MedicalLicenseId { get; set; }
    public int DocumentId { get; set; }

    public MedicalLicenseDocument() { }

    public MedicalLicenseDocument(int medicalLicenseId) => MedicalLicenseId = medicalLicenseId;
}
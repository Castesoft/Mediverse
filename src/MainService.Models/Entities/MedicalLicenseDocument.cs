namespace MainService.Models.Entities;
public class MedicalLicenseDocument
{
    public MedicalLicenseDocument() { }
    public MedicalLicenseDocument(string documentPublicId, string documentUrl) => Document = new (documentPublicId, documentUrl);

    public MedicalLicense MedicalLicense { get; set; }
    public Document Document { get; set; }
    public int MedicalLicenseId { get; set; }
    public int DocumentId { get; set; }
}
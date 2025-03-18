namespace MainService.Models.Entities;
public class MedicalLicenseDocument
{
    public MedicalLicenseDocument() { }
    public MedicalLicenseDocument(string documentPublicId, string documentUrl) => Document = new (documentPublicId, documentUrl);
    public MedicalLicenseDocument(Document document) => Document = document;

    public MedicalLicense MedicalLicense { get; set; } = null!;
    public Document Document { get; set; } = null!;
    public int MedicalLicenseId { get; set; }
    public int DocumentId { get; set; }
}
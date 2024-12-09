namespace MainService.Models.Entities;
public class Document : BaseEntity
{
    public Document() { }
    public Document(string documentPublicId, string documentUrl) {
        PublicId = documentPublicId;
        Url = documentUrl;
    }

    public string? Url { get; set; }
    public string? PublicId { get; set; }
    public int? Size { get; set; }

    public string? ThumbnailUrl { get; set; }
    public string? ThumbnailPublicId { get; set; }
    public int? ThumbnailSize { get; set; }

    public MedicalLicenseDocument MedicalLicenseDocument { get; set; } = null!;
    public UserMedicalInsuranceCompany UserMedicalInsuranceCompany { get; set; } = null!;
}
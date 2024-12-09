using CloudinaryDotNet.Actions;

namespace MainService.Models.Entities;
public class Photo : BaseEntity
{
    public string? Url { get; set; }
    public string? PublicId { get; set; }
    public int? Size { get; set; }

    public UserPhoto UserPhoto { get; set; } = null!;
    public DoctorBannerPhoto DoctorBannerPhoto { get; set; } = null!;
    public ClinicLogo ClinicLogo { get; set; } = null!;
    public ProductPhoto ProductPhoto { get; set; } = null!;
    public ServicePhoto ServicePhoto { get; set; } = null!;
    public DoctorSignature DoctorSignature { get; set; } = null!;
    public MedicalInsuranceCompanyPhoto MedicalInsuranceCompanyPhoto { get; set; } = null!;

    public Photo() {}

    public Photo(ImageUploadResult result, int userId)
    {
        Url = result.SecureUrl.AbsoluteUri;
        PublicId = result.PublicId;
        UserPhoto = new(userId);
    }
}
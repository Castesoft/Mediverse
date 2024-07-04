using CloudinaryDotNet.Actions;

namespace MainService.Models.Entities;
public class Photo : BaseEntity
{
    public string Url { get; set; }
    public string PublicId { get; set; }
    public string Name { get; set; }
    public int Size { get; set; }

    public UserPhoto UserPhoto { get; set; }
    public ProductPhoto ProductPhoto { get; set; }
    public ServicePhoto ServicePhoto { get; set; }
    public DoctorSignature DoctorSignature { get; set; }
    public PrescriptionLogo PrescriptionLogo { get; set; }

    public Photo(){}

    public Photo(ImageUploadResult result, int userId)
    {
        Url = result.SecureUrl.AbsoluteUri;
        PublicId = result.PublicId;
        UserPhoto = new(userId);
    }
}
namespace MainService.Models.Entities;
public class UserMedicalLicense
{
    public UserMedicalLicense() {}
    public UserMedicalLicense(int specialtyId) => MedicalLicense = new (specialtyId);
    public UserMedicalLicense(int specialtyId, string documentPublicId, string documentUrl) => MedicalLicense = new (specialtyId, documentPublicId, documentUrl);
    
    public int UserId { get; set; }
    public int MedicalLicenseId { get; set; }
    public AppUser User { get; set; }
    public MedicalLicense MedicalLicense { get; set; }

    public bool IsMain { get; set; }
}
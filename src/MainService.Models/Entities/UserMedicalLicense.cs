namespace MainService.Models.Entities;
public class UserMedicalLicense
{
    public int UserId { get; set; }
    public int MedicalLicenseId { get; set; }
    public AppUser User { get; set; }
    public MedicalLicense MedicalLicense { get; set; }

    public bool IsMain { get; set; }
}
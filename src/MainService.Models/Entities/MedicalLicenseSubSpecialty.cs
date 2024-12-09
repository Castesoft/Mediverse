namespace MainService.Models.Entities;
public class MedicalLicenseSubSpecialty
{
    public int MedicalLicenseId { get; set; }
    public int SubSpecialtyId { get; set; }
    public MedicalLicense MedicalLicense { get; set; } = null!;
    public SubSpecialty SubSpecialty { get; set; } = null!;
}
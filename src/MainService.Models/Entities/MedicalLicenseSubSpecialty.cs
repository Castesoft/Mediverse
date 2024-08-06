namespace MainService.Models.Entities;
public class MedicalLicenseSubSpecialty
{
    public int MedicalLicenseId { get; set; }
    public int SubSpecialtyId { get; set; }
    public MedicalLicense MedicalLicense { get; set; }
    public SubSpecialty SubSpecialty { get; set; }
}
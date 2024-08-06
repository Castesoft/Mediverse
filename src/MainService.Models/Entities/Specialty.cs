namespace MainService.Models.Entities;
public class Specialty : BaseEntity
{
    
    public ICollection<UserMedicalLicense> UserMedicalLicenses { get; set; } = [];
    public ICollection<SpecialtyService> SpecialtyServices { get; set; } = [];
}
namespace MainService.Models.Entities;
public class Specialty : BaseEntity
{
    public ICollection<MedicalLicenseSpecialty> MedicalLicenseSpecialties { get; set; } = [];
    public ICollection<SpecialtyService> SpecialtyServices { get; set; } = [];
    public ICollection<SpecialitySubSpecialty> SpecialitySubSpecialties { get; set; } = [];
}
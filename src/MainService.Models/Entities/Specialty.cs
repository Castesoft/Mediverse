using MainService.Models.Entities.Aggregate;

namespace MainService.Models.Entities;
public class Specialty : BaseCodeEntity
{
    public List<MedicalLicenseSpecialty> MedicalLicenseSpecialties { get; set; } = [];
    public List<SpecialtyService> SpecialtyServices { get; set; } = [];
    public List<SpecialitySubSpecialty> SpecialitySubSpecialties { get; set; } = [];
}

public class SpecialtyDto : BaseCodeEntity {}
public class SpecialtyParams : BaseCodeParams {}
public class SpecialtyCreateDto : BaseCodeManageDto {}
public class SpecialtyUpdateDto : BaseCodeManageDto {}

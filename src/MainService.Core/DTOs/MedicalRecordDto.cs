using System.ComponentModel.DataAnnotations;
using MainService.Models.Entities;
using MainService.Models.Entities.Aggregate;

namespace MainService.Core.DTOs
{
    public class MedicalRecordEducationLevelDto : BaseCodeEntity {}
    public class MedicalRecordOccupationDto : BaseCodeEntity {}
    public class MedicalRecordMaritalStatusDto : BaseCodeEntity {}
    public class MedicalRecordColorBlindnessDto : BaseCodeEntity {}
    public class MedicalRecordFamilyMemberDto {
        public int Id { get; set; }
        public OptionDto RelativeType { get; set; }
        public string Name { get; set; }
        public int Age { get; set; }
    }
    public class FamilyMemberDto : BaseEntity {
        public int Age { get; set; }
        public RelativeTypeDto RelativeType { get; set; }
    }
    public class PersonalDiseaseDto : BaseEntity {
        public DiseaseDto Disease { get; set; }
        public string Other { get; set; }
    }
    public class PersonalSubstanceDto : BaseEntity {
        public SubstanceDto Substance { get; set; }
        public ConsumptionLevelDto ConsumptionLevel { get; set; }
        public int StartAge { get; set; }
        public int EndAge { get; set; }
        public bool IsCurrent { get; set; }
        public string Other { get; set; }
    }
    public class FamilyDiseaseDto : BaseEntity {
        public RelativeTypeDto RelativeType { get; set; }
        public DiseaseDto Disease { get; set; }
        public string Other { get; set; }
    }

    public class MedicalRecordCompanionDto : BaseEntity {
        public int Age { get; set; }
        public OptionDto Sex { get; set; }
        public string Address { get; set; }
        public string HomePhone { get; set; }
        public string PhoneNumber { get; set; }
        public string Email { get; set; }
        public OptionDto Occupation { get; set; }
        public OptionDto RelativeType { get; set; }
    }

    public class MedicalRecordPersonalDiseaseDto {
        public int Id { get; set; }
        public OptionDto Disease { get; set; }
        public string Description { get; set; }
    }
    public class MedicalRecordFamilyDiseaseDto {
        public int Id { get; set; }
        public OptionDto Disease { get; set; }
        public OptionDto RelativeType { get; set; }
        public string Description { get; set; }
    }

    public class MedicalRecordSubstanceDto {
        public int Id { get; set; }
        public OptionDto Substance { get; set; }
        public OptionDto ConsumptionLevel { get; set; }
        public int StartAge { get; set; }
        public int EndAge { get; set; }
        public bool IsCurrent { get; set; }
    }
    
    public class MedicalRecordDto
    {
        public int Id { get; set; }
        public OptionDto EducationLevel { get; set; }
        public OptionDto Occupation { get; set; }
        public OptionDto ColorBlindness { get; set; }
        public OptionDto MaritalStatus { get; set; }
        public List<MedicalRecordFamilyMemberDto> FamilyMembers { get; set; } = [];
        public List<MedicalRecordPersonalDiseaseDto> PersonalMedicalHistory { get; set; } = [];
        public List<MedicalRecordFamilyDiseaseDto> FamilyMedicalHistory { get; set; } = [];
        public List<MedicalRecordSubstanceDto> PersonalDrugHistory { get; set; } = [];

        public string PatientName { get; set; }
        public int Age { get; set; }
        public OptionDto Sex { get; set; }
        public string BirthPlace { get; set; }
        public DateTime BirthDate { get; set; }
        public int YearsOfSchooling { get; set; }
        public OptionDto HandDominance { get; set; }
        public string CurrentLivingSituation { get; set; }
        public string CurrentAddress { get; set; }
        public string HomePhone { get; set; }
        public string MobilePhone { get; set; }
        public string Email { get; set; }
        public bool HasCompanion { get; set; }
        public string EconomicDependence { get; set; }
        public bool UsesGlassesOrHearingAid { get; set; }
        public string Comments { get; set; }

        public MedicalRecordCompanionDto Companion { get; set; }
    }

    public class DiseaseDto : BaseCodeEntity {}
    public class SubstanceDto : BaseCodeEntity {}
    public class OccupationDto : BaseCodeEntity {}
    public class MaritalStatusDto : BaseCodeEntity {}
    public class EducationLevelDto : BaseCodeEntity {}
    public class ColorBlindnessDto : BaseCodeEntity {}
    public class RelativeTypeDto : BaseCodeEntity {}
    public class ConsumptionLevelDto : BaseCodeEntity {}

    public class DiseaseUpdateDto : BaseCodeManageDto {}
    public class SubstanceUpdateDto : BaseCodeManageDto {}
    public class OccupationUpdateDto : BaseCodeManageDto {}
    public class MaritalStatusUpdateDto : BaseCodeManageDto {}
    public class EducationLevelUpdateDto : BaseCodeManageDto {}
    public class ColorBlindnessUpdateDto : BaseCodeManageDto {}
    public class RelativeTypeUpdateDto : BaseCodeManageDto {}
    public class ConsumptionLevelUpdateDto : BaseCodeManageDto {}

    public class DiseaseCreateDto : BaseCodeManageDto {}
    public class SubstanceCreateDto : BaseCodeManageDto {}
    public class OccupationCreateDto : BaseCodeManageDto {}
    public class MaritalStatusCreateDto : BaseCodeManageDto {}
    public class EducationLevelCreateDto : BaseCodeManageDto {}
    public class ColorBlindnessCreateDto : BaseCodeManageDto {}
    public class RelativeTypeCreateDto : BaseCodeManageDto {}
    public class ConsumptionLevelCreateDto : BaseCodeManageDto {}

    public class DiseaseParams : BaseCodeParams {}
    public class SubstanceParams : BaseCodeParams {}
    public class OccupationParams : BaseCodeParams {}
    public class MaritalStatusParams : BaseCodeParams {}
    public class EducationLevelParams : BaseCodeParams {}
    public class ColorBlindnessParams : BaseCodeParams {}
    public class RelativeTypeParams : BaseCodeParams {}
    public class ConsumptionLevelParams : BaseCodeParams {}
    public class DocumentParams : BaseCodeParams {}

    

    public class MedicalRecordUpdateFamilyMemberDto {
        public int? Age { get; set; }
        public string? Name { get; set; }
        public OptionDto? RelativeType { get; set; }
    }

    public class MedicalRecordUpdatePersonalDiseaseDto {
        public OptionDto? Disease { get; set; }
        public string? Description { get; set; }
        public string? Other { get; set; }
    }

    public class MedicalRecordUpdateFamilyDiseaseDto {
        public OptionDto? RelativeType { get; set; }
        public DiseaseDto? Disease { get; set; }
        public string? Description { get; set; }
        public string? Other { get; set; }
    }

    public class MedicalRecordUpdatePersonalSubstanceDto {
        public SubstanceDto? Substance { get; set; }
        public ConsumptionLevelDto? ConsumptionLevel { get; set; }
        public int? StartAge { get; set; }
        public int? EndAge { get; set; }
        public bool? IsCurrent { get; set; }
        public string? Other { get; set; }
    }

    public class MedicalRecordUpdateCompanionDto {
        public int? Age { get; set; }
        public string? Name { get; set; }
        public OptionDto? Sex { get; set; }
        public string? Address { get; set; }
        public string? HomePhone { get; set; }
        public string? PhoneNumber { get; set; }
        public string? Email { get; set; }
        public OptionDto? RelativeType { get; set; }
        public OptionDto? Occupation { get; set; }
    }

    public class MedicalRecordUpdateDto {
        [Required(ErrorMessage = "El nombre es requerido.")]
        [StringLength(500, ErrorMessage = "El nombre no puede exceder los 500 caracteres.")]
        public string? PatientName { get; set; }

        [Required(ErrorMessage = "La edad es requerida.")]
        [Range(1, 150, ErrorMessage = "La edad debe estar entre 1 y 150 años.")]
        public int? Age { get; set; }

        [Required(ErrorMessage = "El sexo es requerido.")]
        public OptionDto? Sex { get; set; }

        [Required(ErrorMessage = "El lugar de nacimiento es requerido.")]
        [StringLength(500, ErrorMessage = "El lugar de nacimiento no puede exceder los 500 caracteres.")]
        public string? BirthPlace { get; set; }

        [Required(ErrorMessage = "La fecha de nacimiento es requerida.")]
        public DateTime? BirthDate { get; set; }

        [Required(ErrorMessage = "Los años de escolaridad son requeridos.")]
        [Range(1, 50, ErrorMessage = "Los años de escolaridad deben estar entre 1 y 50 años.")]
        public int? YearsOfSchooling { get; set; }

        [Required(ErrorMessage = "La dominancia manual es requerida.")]
        public OptionDto? HandDominance { get; set; }

        [Required(ErrorMessage = "La situación de vida actual es requerida.")]
        [StringLength(500, ErrorMessage = "La situación de vida actual no puede exceder los 500 caracteres.")]
        public string? CurrentLivingSituation { get; set; }

        [Required(ErrorMessage = "La dirección actual es requerida.")]
        [StringLength(500, ErrorMessage = "La dirección actual no puede exceder los 500 caracteres.")]
        public string? CurrentAddress { get; set; }

        public string? HomePhone { get; set; }

        [Required(ErrorMessage = "El teléfono móvil es requerido.")]
        [StringLength(50, ErrorMessage = "El teléfono móvil no puede exceder los 50 caracteres.")]
        public string? MobilePhone { get; set; }

        [Required(ErrorMessage = "El correo electrónico es requerido.")]
        [StringLength(500, ErrorMessage = "El correo electrónico no puede exceder los 500 caracteres.")]
        [EmailAddress(ErrorMessage = "El correo electrónico no es válido.")]
        public string? Email { get; set; }

        public string? EconomicDependence { get; set; }

        [Required(ErrorMessage = "La asistencia es requerida.")]
        public bool? HasCompanion { get; set; }

        [Required(ErrorMessage = "El uso de lentes o audífonos es requerido.")]
        public bool? UsesGlassesOrHearingAid { get; set; }
        public string? Comments { get; set; }

        public MedicalRecordUpdateCompanionDto? Companion { get; set; }



        [Required(ErrorMessage = "El nivel de educación es requerido.")]
        public OptionDto? EducationLevel { get; set; }

        [Required(ErrorMessage = "La ocupación es requerida.")]
        public OptionDto? Occupation { get; set; }

        [Required(ErrorMessage = "El estado civil es requerido.")]
        public OptionDto? MaritalStatus { get; set; }

        public OptionDto? ColorBlindness { get; set; }

        public List<MedicalRecordUpdateFamilyMemberDto> FamilyMembers { get; set; } = [];
        public List<MedicalRecordUpdatePersonalDiseaseDto> PersonalMedicalHistory { get; set; } = [];
        public List<MedicalRecordUpdatePersonalSubstanceDto> PersonalDrugHistory { get; set; } = [];
        public List<MedicalRecordUpdateFamilyDiseaseDto> FamilyMedicalHistory { get; set; } = [];
    }

    
}
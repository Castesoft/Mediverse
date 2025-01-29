using System.ComponentModel.DataAnnotations;
using MainService.Models.Entities.Aggregate;

namespace MainService.Core.DTOs.MedicalRecord;

public class MedicalRecordUpdateDto
{
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
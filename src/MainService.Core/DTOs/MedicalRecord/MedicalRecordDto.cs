using System.ComponentModel.DataAnnotations;
using MainService.Models.Entities;
using MainService.Models.Entities.Aggregate;

namespace MainService.Core.DTOs.MedicalRecord
{
    public class MedicalRecordEducationLevelDto : BaseCodeEntity;

    public class MedicalRecordOccupationDto : BaseCodeEntity;

    public class MedicalRecordMaritalStatusDto : BaseCodeEntity;

    public class MedicalRecordColorBlindnessDto : BaseCodeEntity;

    public class MedicalRecordFamilyMemberDto
    {
        public int Id { get; set; }
        public OptionDto? RelativeType { get; set; }
        public string? Name { get; set; }
        public int Age { get; set; }
    }

    public class FamilyMemberDto : BaseEntity
    {
        public int Age { get; set; }
        public RelativeTypeDto? RelativeType { get; set; }
    }

    public class PersonalDiseaseDto : BaseEntity
    {
        public DiseaseDto? Disease { get; set; }
        public string? Other { get; set; }
    }

    public class PersonalSubstanceDto : BaseEntity
    {
        public SubstanceDto? Substance { get; set; }
        public ConsumptionLevelDto? ConsumptionLevel { get; set; }
        public int StartAge { get; set; }
        public int EndAge { get; set; }
        public bool IsCurrent { get; set; }
        public string? Other { get; set; }
    }

    public class FamilyDiseaseDto : BaseEntity
    {
        public RelativeTypeDto? RelativeType { get; set; }
        public DiseaseDto? Disease { get; set; }
        public string? Other { get; set; }
    }

    public class MedicalRecordCompanionDto : BaseEntity
    {
        public int Age { get; set; }
        public OptionDto? Sex { get; set; }
        public string? Address { get; set; }
        public string? HomePhone { get; set; }
        public string? PhoneNumber { get; set; }
        public string? Email { get; set; }
        public OptionDto? Occupation { get; set; }
        public OptionDto? RelativeType { get; set; }
    }

    public class MedicalRecordPersonalDiseaseDto
    {
        public int Id { get; set; }
        public OptionDto? Disease { get; set; }
        public string? Description { get; set; }
    }

    public class MedicalRecordFamilyDiseaseDto
    {
        public int Id { get; set; }
        public OptionDto? Disease { get; set; }
        public OptionDto? RelativeType { get; set; }
        public string? Description { get; set; }
    }

    public class MedicalRecordSubstanceDto
    {
        public int Id { get; set; }
        public OptionDto? Substance { get; set; }
        public OptionDto? ConsumptionLevel { get; set; }
        public int StartAge { get; set; }
        public int EndAge { get; set; }
        public bool IsCurrent { get; set; }
    }

    public class MedicalRecordDto
    {
        public int Id { get; set; }
        public OptionDto? EducationLevel { get; set; }
        public OptionDto? Occupation { get; set; }
        public OptionDto? ColorBlindness { get; set; }
        public OptionDto? MaritalStatus { get; set; }
        public List<MedicalRecordFamilyMemberDto> FamilyMembers { get; set; } = [];
        public List<MedicalRecordPersonalDiseaseDto> PersonalMedicalHistory { get; set; } = [];
        public List<MedicalRecordFamilyDiseaseDto> FamilyMedicalHistory { get; set; } = [];
        public List<MedicalRecordSubstanceDto> PersonalDrugHistory { get; set; } = [];

        public string? PatientName { get; set; }
        public int Age { get; set; }
        public OptionDto? Sex { get; set; }
        public string? BirthPlace { get; set; }
        public DateTime BirthDate { get; set; }
        public int YearsOfSchooling { get; set; }
        public OptionDto? HandDominance { get; set; }
        public string? CurrentLivingSituation { get; set; }
        public string? CurrentAddress { get; set; }
        public string? HomePhone { get; set; }
        public string? MobilePhone { get; set; }
        public string? Email { get; set; }
        public bool HasCompanion { get; set; }
        public string? EconomicDependence { get; set; }
        public bool UsesGlassesOrHearingAid { get; set; }
        public string? Comments { get; set; }

        public MedicalRecordCompanionDto? Companion { get; set; }
    }

    public class DiseaseDto : BaseCodeEntity;

    public class SubstanceDto : BaseCodeEntity;

    public class OccupationDto : BaseCodeEntity;

    public class MaritalStatusDto : BaseCodeEntity;

    public class EducationLevelDto : BaseCodeEntity;

    public class ColorBlindnessDto : BaseCodeEntity;

    public class RelativeTypeDto : BaseCodeEntity;

    public class ConsumptionLevelDto : BaseCodeEntity;

    public class DiseaseUpdateDto : BaseCodeManageDto;

    public class SubstanceUpdateDto : BaseCodeManageDto;

    public class OccupationUpdateDto : BaseCodeManageDto;

    public class MaritalStatusUpdateDto : BaseCodeManageDto;

    public class EducationLevelUpdateDto : BaseCodeManageDto;

    public class ColorBlindnessUpdateDto : BaseCodeManageDto;

    public class RelativeTypeUpdateDto : BaseCodeManageDto;

    public class ConsumptionLevelUpdateDto : BaseCodeManageDto;

    public class DiseaseCreateDto : BaseCodeManageDto;

    public class SubstanceCreateDto : BaseCodeManageDto;

    public class OccupationCreateDto : BaseCodeManageDto;

    public class MaritalStatusCreateDto : BaseCodeManageDto;

    public class EducationLevelCreateDto : BaseCodeManageDto;

    public class ColorBlindnessCreateDto : BaseCodeManageDto;

    public class RelativeTypeCreateDto : BaseCodeManageDto;

    public class ConsumptionLevelCreateDto : BaseCodeManageDto;

    public class DiseaseParams : BaseCodeParams;

    public class SubstanceParams : BaseCodeParams;

    public class OccupationParams : BaseCodeParams;

    public class MaritalStatusParams : BaseCodeParams;

    public class EducationLevelParams : BaseCodeParams;

    public class ColorBlindnessParams : BaseCodeParams;

    public class RelativeTypeParams : BaseCodeParams;

    public class ConsumptionLevelParams : BaseCodeParams;

    public class DocumentParams : BaseCodeParams;
}
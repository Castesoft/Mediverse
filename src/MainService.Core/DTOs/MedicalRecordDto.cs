using MainService.Models.Entities;
using MainService.Models.Entities.Aggregate;

namespace MainService.Core.DTOs
{
    public class MedicalRecordEducationLevelDto : BaseEntity {}
    public class MedicalRecordOccupationDto : BaseEntity {}
    public class MedicalRecordMaritalStatusDto : BaseEntity {}
    public class MedicalRecordColorBlindnessDto : BaseEntity {}
    public class MedicalRecordFamilyMemberDto : BaseEntity {}
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
        public string Sex { get; set; }
        public string Address { get; set; }
        public string HomePhone { get; set; }
        public string PhoneNumber { get; set; }
        public string Email { get; set; }
        public MedicalRecordOccupationDto Occupation { get; set; }
    }

    public class MedicalRecordPersonalDiseaseDto : BaseEntity {}
    public class MedicalRecordFamilyDiseaseDto : BaseEntity {
        public string FamilyMember { get; set; }
    }

    public class MedicalRecordSubstanceDto : BaseEntity {
        public ConsumptionLevelDto ConsumptionLevel { get; set; }
    }
    
    public class MedicalRecordDto : BaseEntity
    {
        public MedicalRecordEducationLevelDto EducationLevel { get; set; }
        public MedicalRecordOccupationDto Occupation { get; set; }
        public MedicalRecordColorBlindness MedicalRecordColorBlindness { get; set; }
        public MedicalRecordMaritalStatusDto MaritalStatus { get; set; }
        public List<MedicalRecordFamilyMemberDto> FamilyMembers { get; set; } = [];
        public MedicalRecordCompanionDto Companion { get; set; }
        public List<MedicalRecordPersonalDiseaseDto> PersonalDiseases { get; set; } = [];
        public List<MedicalRecordFamilyDiseaseDto> FamilyDiseases { get; set; } = [];
        public List<MedicalRecordSubstanceDto> Substances { get; set; } = [];

        public string PatientName { get; set; }
        public int Age { get; set; }
        public string Sex { get; set; }
        public string BirthPlace { get; set; }
        public DateTime BirthDate { get; set; }
        public int YearsOfSchooling { get; set; }
        public string HandDominance { get; set; }
        public string CurrentLivingSituation { get; set; }
        public string CurrentAddress { get; set; }
        public string HomePhone { get; set; }
        public string MobilePhone { get; set; }
        public string Email { get; set; }
        public bool AttendedAlone { get; set; }
        public string EconomicDependence { get; set; }
        public bool UsesGlassesOrHearingAid { get; set; }
        public string Comments { get; set; }
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

    public class MedicalRecordUpdateDto {
        public string Name { get; set; }
        public int Age { get; set; }
        public string Sex { get; set; }
        public string BirthPlace { get; set; }
        public DateTime BirthDate { get; set; }
        public int YearsOfSchooling { get; set; }
        public string HandDominance { get; set; }
        public string CurrentLivingSituation { get; set; }
        public string CurrentAddress { get; set; }
        public string HomePhone { get; set; }
        public string MobilePhone { get; set; }
        public string Email { get; set; }
        public bool AttendedAlone { get; set; }
        public string CompanionName { get; set; }
        public RelativeTypeDto CompanionRelationship { get; set; }
        public int CompanionAge { get; set; }
        public string CompanionSex { get; set; }
        public OccupationDto CompanionOccupation { get; set; }
        public string CompanionCurrentAddress { get; set; }
        public string CompanionHomePhone { get; set; }
        public string CompanionMobilePhone { get; set; }
        public string CompanionEmail { get; set; }
        public string EconomicDependence { get; set; }
        public bool UsesGlassesOrHearingAid { get; set; }
        public string Comments { get; set; }

        public EducationLevelDto EducationLevel { get; set; }
        public OccupationDto Occupation { get; set; }
        public MaritalStatusDto MaritalStatus { get; set; }
        public ColorBlindnessDto ColorBlindness { get; set; }
        public List<FamilyMemberDto> FamilyStructure { get; set; } = [];
        public List<PersonalDiseaseDto> PersonalMedicalHistory { get; set; } = [];
        public List<PersonalSubstanceDto> PersonalDrugHistory { get; set; } = [];
        public List<FamilyDiseaseDto> FamilyMedicalHistory { get; set; } = [];
    }
}
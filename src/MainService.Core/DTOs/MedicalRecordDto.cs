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
    public class ColorBlindnessDto : BaseCodeEntity {}
    public class RelativeTypeDto : BaseCodeEntity {}
    public class ConsumptionLevelDto : BaseCodeEntity {}

    public class DiseaseUpdateDto : BaseCodeEntity {}
    public class SubstanceUpdateDto : BaseCodeEntity {}
    public class OccupationUpdateDto : BaseCodeEntity {}
    public class MaritalStatusUpdateDto : BaseCodeEntity {}
    public class ColorBlindnessUpdateDto : BaseCodeEntity {}
    public class RelativeTypeUpdateDto : BaseCodeEntity {}
    public class ConsumptionLevelUpdateDto : BaseCodeEntity {}

    public class DiseaseCreateDto : BaseCodeEntity {}
    public class SubstanceCreateDto : BaseCodeEntity {}
    public class OccupationCreateDto : BaseCodeEntity {}
    public class MaritalStatusCreateDto : BaseCodeEntity {}
    public class ColorBlindnessCreateDto : BaseCodeEntity {}
    public class RelativeTypeCreateDto : BaseCodeEntity {}
    public class ConsumptionLevelCreateDto : BaseCodeEntity {}

    public class DiseaseParams : BaseCodeParams {}
    public class SubstanceParams : BaseCodeParams {}
    public class OccupationParams : BaseCodeParams {}
    public class MaritalStatusParams : BaseCodeParams {}
    public class ColorBlindnessParams : BaseCodeParams {}
    public class RelativeTypeParams : BaseCodeParams {}
    public class ConsumptionLevelParams : BaseCodeParams {}
}
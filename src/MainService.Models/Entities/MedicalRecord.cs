namespace MainService.Models.Entities
{
    public class UserMedicalRecord
    {
        public int UserId { get; set; }
        public AppUser User { get; set; }
        public int MedicalRecordId { get; set; }
        public MedicalRecord MedicalRecord { get; set; }
    }

    public class MedicalRecord : BaseEntity
    {
        // Identification Data
        public string PatientName { get; set; }
        public int Age { get; set; }
        public string Sex { get; set; }
        public string BirthPlace { get; set; }
        public DateTime BirthDate { get; set; }
        public UserMedicalRecord UserMedicalRecord { get; set; }

        public MedicalRecordEducationLevel MedicalRecordEducationLevel { get; set; }
        
        public int YearsOfSchooling { get; set; }

        public MedicalRecordOccupation MedicalRecordOccupation { get; set; }
        
        public string HandDominance { get; set; }

        public MedicalRecordMaritalStatus MedicalRecordMaritalStatus { get; set; }
        
        public string CurrentLivingSituation { get; set; }
        public string CurrentAddress { get; set; }
        public string HomePhone { get; set; }
        public string MobilePhone { get; set; }
        public string Email { get; set; }
        public bool AttendedAlone { get; set; }
        public string EconomicDependence { get; set; }
        public bool UsesGlassesOrHearingAid { get; set; }

        public MedicalRecordColorBlindness MedicalRecordColorBlindness { get; set; }
        

        public List<MedicalRecordFamilyMember> MedicalRecordFamilyMembers { get; set; } = [];
        

        public MedicalRecordCompanion MedicalRecordCompanion { get; set; }


        public List<MedicalRecordPersonalDisease> MedicalRecordPersonalDiseases { get; set; } = [];
        public List<MedicalRecordFamilyDisease> MedicalRecordFamilyDiseases { get; set; } = [];

        public List<MedicalRecordSubstance> MedicalRecordSubstances { get; set; } = [];

        public string Comments { get; set; }
    }

    public class MedicalRecordEducationLevel
    {
        public int MedicalRecordId { get; set; } public MedicalRecord MedicalRecord { get; set; }
        public int EducationLevelId { get; set; } public EducationLevel EducationLevel { get; set; }
    }

    public class EducationLevel : BaseEntity
    {
        public EducationLevel() { }
        public EducationLevel(string name) => Name = name;
        public EducationLevel(string name, string description)
        {
            Name = name;
            Description = description;
        }
        
        // Navigation Properties
        public List<MedicalRecordEducationLevel> MedicalRecordEducationLevels { get; set; } = [];
    }

    public class MedicalRecordOccupation
    {
        public int MedicalRecordId { get; set; } public MedicalRecord MedicalRecord { get; set; }
        public int OccupationId { get; set; } public Occupation Occupation { get; set; }

        public string Other { get; set; }
    }

    public class Occupation : BaseEntity
    {
        public Occupation() { }
        public Occupation(string name) => Name = name;
        public Occupation(string name, string description)
        {
            Name = name;
            Description = description;
        }
        
        public List<MedicalRecordOccupation> MedicalRecordOccupations { get; set; } = [];
        public CompanionOccupation CompanionOccupation { get; set; }
    }

    public class MedicalRecordMaritalStatus
    {
        public int MedicalRecordId { get; set; } public MedicalRecord MedicalRecord { get; set; }
        public int MaritalStatusId { get; set; } public MaritalStatus MaritalStatus { get; set; }

        public string Other { get; set; }
    }

    public class MaritalStatus : BaseEntity
    {
        public MaritalStatus() { }
        public MaritalStatus(string name) => Name = name;
        public MaritalStatus(string name, string description)
        {
            Name = name;
            Description = description;
        }
        
        public List<MedicalRecordMaritalStatus> MedicalRecordMaritalStatuses { get; set; } = [];
    }

    public class MedicalRecordColorBlindness {
        public int MedicalRecordId { get; set; } public MedicalRecord MedicalRecord { get; set; }
        public int ColorBlindnessId { get; set; } public ColorBlindness ColorBlindness { get; set; }

        public string Other { get; set; }
        public bool IsPresent { get; set; }
    }

    public class ColorBlindness : BaseEntity
    {
        public ColorBlindness() { }
        public ColorBlindness(string name) => Name = name;
        public ColorBlindness(string name, string description)
        {
            Name = name;
            Description = description;
        }
        
        public List<MedicalRecordColorBlindness> MedicalRecordColorBlindnesses { get; set; } = [];
    }

    public class MedicalRecordFamilyMember {
        public int MedicalRecordId { get; set; } public MedicalRecord MedicalRecord { get; set; }
        public int FamilyMemberId { get; set; } public FamilyMember FamilyMember { get; set; }
    }

    public class FamilyMember : BaseEntity
    {
        public FamilyMember() { }
        public FamilyMember(string name) => Name = name;
        public FamilyMember(string name, string description)
        {
            Name = name;
            Description = description;
        }

        public int Age { get; set; }
        
        public MedicalRecordFamilyMember MedicalRecordFamilyMember { get; set; }
        public MedicalRecordFamilyMemberRelativeType MedicalRecordFamilyMemberRelativeType { get; set; }
    }

    public class MedicalRecordFamilyMemberRelativeType
    {
        public int FamilyMemberId { get; set; } public FamilyMember FamilyMember { get; set; }
        public int RelativeTypeId { get; set; } public RelativeType RelativeType { get; set; }
    }

    public class RelativeType : BaseEntity
    {
        public RelativeType() { }
        public RelativeType(string name) => Name = name;
        public RelativeType(string name, string description)
        {
            Name = name;
            Description = description;
        }
        
        public MedicalRecordFamilyMemberRelativeType MedicalRecordFamilyMemberRelativeType { get; set; }
        public CompanionRelativeType CompanionRelativeType { get; set; }
    }

    public class MedicalRecordCompanion
    {
        public int MedicalRecordId { get; set; } public MedicalRecord MedicalRecord { get; set; }
        public int CompanionId { get; set; } public Companion Companion { get; set; }
    }

    public class CompanionRelativeType {
        public int CompanionId { get; set; } public Companion Companion { get; set; }
        public int RelativeTypeId { get; set; } public RelativeType RelativeType { get; set; }
    }

    public class CompanionOccupation {
        public int CompanionId { get; set; } public Companion Companion { get; set; }
        public int OccupationId { get; set; } public Occupation Occupation { get; set; }
    }

    public class Companion : BaseEntity
    {
        public Companion() { }
        
        public CompanionRelativeType CompanionRelativeType { get; set; }
        
        public int Age { get; set; }
        public string Sex { get; set; }

        public CompanionOccupation CompanionOccupation { get; set; }
        
        public string Address { get; set; }
        public string HomePhone { get; set; }
        public string PhoneNumber { get; set; }
        public string Email { get; set; }

        
        public MedicalRecordCompanion MedicalRecordCompanion { get; set; }
    }

    public class MedicalRecordPersonalDisease {
        public int MedicalRecordId { get; set; } public MedicalRecord MedicalRecord { get; set; }
        public int DiseaseId { get; set; } public Disease Disease { get; set; }

        public string Other { get; set; }
    }

    public class MedicalRecordFamilyDisease {
        public int MedicalRecordId { get; set; } public MedicalRecord MedicalRecord { get; set; }
        public int DiseaseId { get; set; } public Disease Disease { get; set; }

        public string FamilyMember { get; set; }
        public string Description { get; set; }
        public string Other { get; set; }
    }

    public class MedicalRecordDiseaseType : BaseEntity
    {
        public MedicalRecordDiseaseType() { }
        public MedicalRecordDiseaseType(string name) => Name = name;
        public MedicalRecordDiseaseType(string name, string description)
        {
            Name = name;
            Description = description;
        }

        public List<MedicalRecordPersonalDisease> MedicalRecordPersonalDiseases { get; set; } = [];
        public MedicalRecordDiseaseTypeDisease MedicalRecordDiseaseTypeDisease { get; set; }
    }

    public class MedicalRecordDiseaseTypeDisease
    {
        public int MedicalRecordDiseaseTypeId { get; set; } public MedicalRecordDiseaseType MedicalRecordDiseaseType { get; set; }
        public int DiseaseId { get; set; } public Disease Disease { get; set; }
    }

    public class Disease : BaseEntity
    {
        public Disease() { }
        public Disease(string name) => Name = name;
        public Disease(string name, string description)
        {
            Name = name;
            Description = description;
        }

        public List<MedicalRecordPersonalDisease> MedicalRecordPersonalDiseases { get; set; } = [];
        public List<MedicalRecordFamilyDisease> MedicalRecordFamilyDiseases { get; set; } = [];
        public List<MedicalRecordDiseaseTypeDisease> MedicalRecordDiseaseTypeDiseases { get; set; } = [];
    }

    public class ConsumptionLevel : BaseEntity
    {
        public ConsumptionLevel() { }
        public ConsumptionLevel(string name) => Name = name;
        public ConsumptionLevel(string name, string description)
        {
            Name = name;
            Description = description;
        }

        public List<MedicalRecordSubstance> MedicalRecordSubstances { get; set; }
    }

    public class MedicalRecordSubstance {
        public int MedicalRecordId { get; set; } public MedicalRecord MedicalRecord { get; set; }
        public int SubstanceId { get; set; } public Substance Substance { get; set; }
        public int ConsumptionLevelId { get; set; } public ConsumptionLevel ConsumptionLevel { get; set; }

        public int StartAge { get; set; }
        public int EndAge { get; set; }
        public bool IsCurrent { get; set; } = false;

        public string Other { get; set; }
    }

    public class Substance : BaseEntity {
        public Substance() { }
        public Substance(string name) => Name = name;
        public Substance(string name, string description) {
            Name = name;
            Description = description;
        }
        
        public List<MedicalRecordSubstance> MedicalRecordSubstances { get; set; } = [];
    }
}

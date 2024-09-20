using MainService.Models.Entities.Aggregate;

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

    public class EducationLevel : BaseCodeEntity
    {
        public EducationLevel() { }
        public EducationLevel(string code) : base(code) { }
        public EducationLevel(string code, string name) : base(code, name) { }
        public EducationLevel(string code, string name, string description) : base(code, name, description) { }
        
        // Navigation Properties
        public List<MedicalRecordEducationLevel> MedicalRecordEducationLevels { get; set; } = [];
    }

    public class MedicalRecordOccupation
    {
        public int MedicalRecordId { get; set; } public MedicalRecord MedicalRecord { get; set; }
        public int OccupationId { get; set; } public Occupation Occupation { get; set; }

        public string Other { get; set; }
    }

    public class Occupation : BaseCodeEntity
    {
        public Occupation() { }
        public Occupation(string code) : base(code) { }
        public Occupation(string code, string name) : base(code, name) { }
        public Occupation(string code, string name, string description) : base(code, name, description) { }
        
        public List<MedicalRecordOccupation> MedicalRecordOccupations { get; set; } = [];
        public List<CompanionOccupation> CompanionOccupations { get; set; } = [];
    }

    public class MedicalRecordMaritalStatus
    {
        public int MedicalRecordId { get; set; } public MedicalRecord MedicalRecord { get; set; }
        public int MaritalStatusId { get; set; } public MaritalStatus MaritalStatus { get; set; }

        public string Other { get; set; }
    }

    public class MaritalStatus : BaseCodeEntity
    {
        public MaritalStatus() { }
        public MaritalStatus(string code) : base(code) { }
        public MaritalStatus(string code, string name) : base(code, name) { }
        public MaritalStatus(string code, string name, string description) : base(code, name, description) { }
        
        public List<MedicalRecordMaritalStatus> MedicalRecordMaritalStatuses { get; set; } = [];
    }

    public class MedicalRecordColorBlindness {
        public int MedicalRecordId { get; set; } public MedicalRecord MedicalRecord { get; set; }
        public int ColorBlindnessId { get; set; } public ColorBlindness ColorBlindness { get; set; }

        public string Other { get; set; }
        public bool IsPresent { get; set; }
    }

    public class ColorBlindness : BaseCodeEntity
    {
        public ColorBlindness() { }
        public ColorBlindness(string code) : base(code) { }
        public ColorBlindness(string code, string name) : base(code, name) { }
        public ColorBlindness(string code, string name, string description) : base(code, name, description) { }
        
        public List<MedicalRecordColorBlindness> MedicalRecordColorBlindnesses { get; set; } = [];
    }

    public class MedicalRecordFamilyMember {
        public int MedicalRecordId { get; set; } public MedicalRecord MedicalRecord { get; set; }
        public int FamilyMemberId { get; set; } public FamilyMember FamilyMember { get; set; }
    }

    public class FamilyMember : BaseCodeEntity
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

    public class RelativeType : BaseCodeEntity
    {
        public RelativeType() { }
        public RelativeType(string code) : base(code) { }
        public RelativeType(string code, string name) : base(code, name) { }
        public RelativeType(string code, string name, string description) : base(code, name, description) { }
        
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

    public class Companion : BaseCodeEntity
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

        public string Description { get; set; }
        public string Other { get; set; }
    }

    public class MedicalRecordFamilyDisease {
        public int MedicalRecordId { get; set; } public MedicalRecord MedicalRecord { get; set; }
        public int DiseaseId { get; set; } public Disease Disease { get; set; }

        public string FamilyMember { get; set; }
        public string Description { get; set; }
        public string Other { get; set; }
    }

    public class MedicalRecordDiseaseType : BaseCodeEntity
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

    public class Disease : BaseCodeEntity
    {
        public Disease() { }
        public Disease(string code) : base(code) { }
        public Disease(string code, string name) : base(code, name) { }
        public Disease(string code, string name, string description) : base(code, name, description) { }

        public List<MedicalRecordPersonalDisease> MedicalRecordPersonalDiseases { get; set; } = [];
        public List<MedicalRecordFamilyDisease> MedicalRecordFamilyDiseases { get; set; } = [];
    }

    public class ConsumptionLevel : BaseCodeEntity
    {
        public ConsumptionLevel() { }
        public ConsumptionLevel(string code) : base(code) { }
        public ConsumptionLevel(string code, string name) : base(code, name) { }
        public ConsumptionLevel(string code, string name, string description) : base(code, name, description) { }

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

    public class Substance : BaseCodeEntity {
        public Substance() { }
        public Substance(string code) : base(code) { }
        public Substance(string code, string name) : base(code, name) { }
        public Substance(string code, string name, string description) : base(code, name, description) { }
        
        public List<MedicalRecordSubstance> MedicalRecordSubstances { get; set; } = [];
    }
}

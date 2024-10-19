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

    #nullable enable

    public class MedicalRecord : BaseEntity
    {
        // Identification Data
        public string PatientName { get; set; } = string.Empty;
        public int Age { get; set; }
        public string Sex { get; set; } = string.Empty;
        public string BirthPlace { get; set; } = string.Empty;
        public DateTime BirthDate { get; set; }
        public int YearsOfSchooling { get; set; }
        public string HandDominance { get; set; } = string.Empty;
        public string CurrentLivingSituation { get; set; } = string.Empty;
        public string CurrentAddress { get; set; } = string.Empty;
        public string? HomePhone { get; set; } = null;
        public string MobilePhone { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public bool HasCompanion { get; set; }
        public string EconomicDependence { get; set; } = string.Empty;
        public bool UsesGlassesOrHearingAid { get; set; }
        public string? Comments { get; set; } = null;


        public List<MedicalRecordFamilyMember> MedicalRecordFamilyMembers { get; set; } = [];
        public List<MedicalRecordPersonalDisease> MedicalRecordPersonalDiseases { get; set; } = [];
        public List<MedicalRecordSubstance> MedicalRecordSubstances { get; set; } = [];
        public List<MedicalRecordFamilyDisease> MedicalRecordFamilyDiseases { get; set; } = [];

        public UserMedicalRecord UserMedicalRecord { get; set; } = null!;
        public MedicalRecordEducationLevel MedicalRecordEducationLevel { get; set; } = null!;
        public MedicalRecordOccupation MedicalRecordOccupation { get; set; } = null!;
        public MedicalRecordMaritalStatus MedicalRecordMaritalStatus { get; set; } = null!;
        public MedicalRecordColorBlindness MedicalRecordColorBlindness { get; set; } = null!;
        public MedicalRecordCompanion MedicalRecordCompanion { get; set; } = null!;

        public OptionDto GetSex() =>
            Sex switch
            {
                "Masculino" => new(1, "Masculino", "Masculino"),
                "Femenino" => new(2, "Femenino", "Femenino"),
                _ => new(3, "unknown", "Desconocido"),
            };

        public OptionDto GetHandDominance() =>
            HandDominance switch
            {
                "Diestro" => new(1, "Diestro", "Diestro"),
                "Zurdo" => new(2, "Zurdo", "Zurdo"),
                "Ambidiestro" => new(3, "Ambidiestro", "Ambidiestro"),
                _ => new(4, "unknown", "Desconocido"),
            };
    }

    #nullable disable

    public class MedicalRecordEducationLevel
    {
        public MedicalRecordEducationLevel() {}
        public MedicalRecordEducationLevel(int educationLevelId) => EducationLevelId = educationLevelId;
        public MedicalRecordEducationLevel(int educationLevelId, int medicalRecordId)
        {
            EducationLevelId = educationLevelId;
            MedicalRecordId = medicalRecordId;
        }
        
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
        public MedicalRecordOccupation() {}
        public MedicalRecordOccupation(int occupationId) => OccupationId = occupationId;
        public MedicalRecordOccupation(int occupationId, int medicalRecordId)
        {
            OccupationId = occupationId;
            MedicalRecordId = medicalRecordId;
        }
        
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
        public MedicalRecordMaritalStatus() {}
        public MedicalRecordMaritalStatus(int maritalStatusId) => MaritalStatusId = maritalStatusId;
        public MedicalRecordMaritalStatus(int maritalStatusId, int medicalRecordId)
        {
            MaritalStatusId = maritalStatusId;
            MedicalRecordId = medicalRecordId;
        }
        
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
        public MedicalRecordColorBlindness() {}
        public MedicalRecordColorBlindness(int colorBlindnessId) => ColorBlindnessId = colorBlindnessId;
        
        public int MedicalRecordId { get; set; } public MedicalRecord MedicalRecord { get; set; }
        public int ColorBlindnessId { get; set; } public ColorBlindness ColorBlindness { get; set; }

        public string Other { get; set; }
        public bool IsPresent { get; set; }
    }

    public class ColorBlindness : BaseCodeEntity
    {
        public ColorBlindness() { }
        public ColorBlindness(string code) : base(code) { }
        public ColorBlindness(string code, string name) {
            Code = code;
            Name = code;
            Description = name;
        }
        public ColorBlindness(string code, string name, string description) : base(code, name, description) { }
        
        public List<MedicalRecordColorBlindness> MedicalRecordColorBlindnesses { get; set; } = [];
    }

    public class MedicalRecordFamilyMember {
        public int MedicalRecordId { get; set; } public MedicalRecord MedicalRecord { get; set; }
        public int FamilyMemberId { get; set; } public FamilyMember FamilyMember { get; set; }
    }

    #nullable enable

    public class FamilyMember
    {
        public int Id { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public int? Age { get; set; } = null;
        public string? Name { get; set; } = null;
        
        public MedicalRecordFamilyMember MedicalRecordFamilyMember { get; set; } = null!;
        public MedicalRecordFamilyMemberRelativeType MedicalRecordFamilyMemberRelativeType { get; set; } = null!;
    }

    #nullable disable

    public class MedicalRecordFamilyMemberRelativeType
    {
        public MedicalRecordFamilyMemberRelativeType() {}
        public MedicalRecordFamilyMemberRelativeType(int relativeTypeId) => RelativeTypeId = relativeTypeId;
        public MedicalRecordFamilyMemberRelativeType(int relativeTypeId, int familyMemberId)
        {
            RelativeTypeId = relativeTypeId;
            FamilyMemberId = familyMemberId;
        }
        
        public int FamilyMemberId { get; set; } public FamilyMember FamilyMember { get; set; }
        public int RelativeTypeId { get; set; } public RelativeType RelativeType { get; set; }
    }

    public class RelativeType : BaseCodeEntity
    {
        public RelativeType() { }
        public RelativeType(string code) : base(code) { }
        public RelativeType(string code, string name) : base(code, name) { }
        public RelativeType(string code, string name, string description) : base(code, name, description) { }
        
        public List<MedicalRecordFamilyMemberRelativeType> MedicalRecordFamilyMemberRelativeTypes { get; set; } = [];
        public List<CompanionRelativeType> CompanionRelativeTypes { get; set; } = [];
        public List<MedicalRecordFamilyDisease> MedicalRecordFamilyDiseases { get; set; } = [];
    }

    public class MedicalRecordCompanion
    {
        public int MedicalRecordId { get; set; } public MedicalRecord MedicalRecord { get; set; }
        public int CompanionId { get; set; } public Companion Companion { get; set; }
    }

    public class CompanionRelativeType {
        public CompanionRelativeType() {}
        public CompanionRelativeType(int relativeTypeId) => RelativeTypeId = relativeTypeId;
        public CompanionRelativeType(int relativeTypeId, int companionId)
        {
            RelativeTypeId = relativeTypeId;
            CompanionId = companionId;
        }
        
        public int CompanionId { get; set; } public Companion Companion { get; set; }
        public int RelativeTypeId { get; set; } public RelativeType RelativeType { get; set; }
    }

    public class CompanionOccupation {
        public CompanionOccupation() {}
        public CompanionOccupation(int occupationId) => OccupationId = occupationId;
        public CompanionOccupation(int occupationId, int companionId)
        {
            OccupationId = occupationId;
            CompanionId = companionId;
        }
        
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

        public OptionDto GetSex() =>
            Sex switch
            {
                "Masculino" => new(1, "Masculino", "Masculino"),
                "Femenino" => new(2, "Femenino", "Femenino"),
                _ => new(3, "unknown", "Desconocido"),
            };
    }

    public class MedicalRecordPersonalDisease {
        public int MedicalRecordId { get; set; } public MedicalRecord MedicalRecord { get; set; }
        public int DiseaseId { get; set; } public Disease Disease { get; set; }

        public string Description { get; set; }
        public string Other { get; set; }
    }

    #nullable enable

    public class MedicalRecordFamilyDisease {
        public int Id { get; set; }
        
        public int MedicalRecordId { get; set; } public MedicalRecord MedicalRecord { get; set; } = null!;
        public int DiseaseId { get; set; } public Disease Disease { get; set; } = null!;
        public int RelativeTypeId { get; set; } public RelativeType RelativeType { get; set; } = null!;

        public string? Description { get; set; } = null;
        public string? Other { get; set; } = null;
    }

    #nullable disable

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

    #nullable enable

    public class MedicalRecordSubstance {
        public int Id { get; set; }
        
        public int MedicalRecordId { get; set; } public MedicalRecord MedicalRecord { get; set; } = null!;
        public int SubstanceId { get; set; } public Substance Substance { get; set; } = null!;
        public int ConsumptionLevelId { get; set; } public ConsumptionLevel ConsumptionLevel { get; set; } = null!;

        public int? StartAge { get; set; } = null;
        public int? EndAge { get; set; } = null;
        public bool IsCurrent { get; set; } = false;

        public string? Other { get; set; } = null;
    }

    #nullable disable


    public class Substance : BaseCodeEntity {
        public Substance() { }
        public Substance(string code) : base(code) { }
        public Substance(string code, string name) : base(code, name) { }
        public Substance(string code, string name, string description) : base(code, name, description) { }
        
        public List<MedicalRecordSubstance> MedicalRecordSubstances { get; set; } = [];
    }
}

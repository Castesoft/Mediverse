using MainService.Models.Entities.Aggregate;

namespace MainService.Models.Entities
{
    public class UserMedicalRecord
    {
        public int UserId { get; set; }
        public AppUser User { get; set; } = null!;
        public int MedicalRecordId { get; set; }
        public MedicalRecord MedicalRecord { get; set; } = null!;
    }

    

    public class MedicalRecord : BaseEntity
    {
        // Identification Data
        public string? PatientName { get; set; }
        public int? Age { get; set; }
        public string? Sex { get; set; }
        public string? BirthPlace { get; set; }
        public DateTime? BirthDate { get; set; }
        public int? YearsOfSchooling { get; set; }
        public string? HandDominance { get; set; }
        public string? CurrentLivingSituation { get; set; }
        public string? CurrentAddress { get; set; }
        public string? HomePhone { get; set; }
        public string? MobilePhone { get; set; }
        public string? Email { get; set; }
        public bool HasCompanion { get; set; } = false;
        public string? EconomicDependence { get; set; }
        public bool? UsesGlassesOrHearingAid { get; set; }
        public string? Comments { get; set; }


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

    

    public class MedicalRecordEducationLevel
    {
        public MedicalRecordEducationLevel() {}
        public MedicalRecordEducationLevel(int educationLevelId) => EducationLevelId = educationLevelId;
        public MedicalRecordEducationLevel(int educationLevelId, int medicalRecordId)
        {
            EducationLevelId = educationLevelId;
            MedicalRecordId = medicalRecordId;
        }
        
        public int MedicalRecordId { get; set; } public MedicalRecord MedicalRecord { get; set; } = null!;
        public int EducationLevelId { get; set; } public EducationLevel EducationLevel { get; set; } = null!;
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
        
        public int MedicalRecordId { get; set; } public MedicalRecord MedicalRecord { get; set; } = null!;
        public int OccupationId { get; set; } public Occupation Occupation { get; set; } = null!;

        public string? Other { get; set; }
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
        
        public int MedicalRecordId { get; set; } public MedicalRecord MedicalRecord { get; set; } = null!;
        public int MaritalStatusId { get; set; } public MaritalStatus MaritalStatus { get; set; } = null!;

        public string? Other { get; set; }
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
        
        public int MedicalRecordId { get; set; } public MedicalRecord MedicalRecord { get; set; } = null!;
        public int ColorBlindnessId { get; set; } public ColorBlindness ColorBlindness { get; set; } = null!;

        public string? Other { get; set; }
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
        public int MedicalRecordId { get; set; } public MedicalRecord MedicalRecord { get; set; } = null!;
        public int FamilyMemberId { get; set; } public FamilyMember FamilyMember { get; set; } = null!;
    }

    

    public class FamilyMember
    {
        public int Id { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public int? Age { get; set; }
        public string? Name { get; set; }
        
        public MedicalRecordFamilyMember MedicalRecordFamilyMember { get; set; } = null!;
        public MedicalRecordFamilyMemberRelativeType MedicalRecordFamilyMemberRelativeType { get; set; } = null!;
    }

    

    public class MedicalRecordFamilyMemberRelativeType
    {
        public MedicalRecordFamilyMemberRelativeType() {}
        public MedicalRecordFamilyMemberRelativeType(int relativeTypeId) => RelativeTypeId = relativeTypeId;
        public MedicalRecordFamilyMemberRelativeType(int relativeTypeId, int familyMemberId)
        {
            RelativeTypeId = relativeTypeId;
            FamilyMemberId = familyMemberId;
        }
        
        public int FamilyMemberId { get; set; } public FamilyMember FamilyMember { get; set; } = null!;
        public int RelativeTypeId { get; set; } public RelativeType RelativeType { get; set; } = null!;
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
        public int MedicalRecordId { get; set; } public MedicalRecord MedicalRecord { get; set; } = null!;
        public int CompanionId { get; set; } public Companion Companion { get; set; } = null!;
    }

    public class CompanionRelativeType {
        public CompanionRelativeType() {}
        public CompanionRelativeType(int relativeTypeId) => RelativeTypeId = relativeTypeId;
        public CompanionRelativeType(int relativeTypeId, int companionId)
        {
            RelativeTypeId = relativeTypeId;
            CompanionId = companionId;
        }
        
        public int CompanionId { get; set; } public Companion Companion { get; set; } = null!;
        public int RelativeTypeId { get; set; } public RelativeType RelativeType { get; set; } = null!;
    }

    public class CompanionOccupation {
        public CompanionOccupation() {}
        public CompanionOccupation(int occupationId) => OccupationId = occupationId;
        public CompanionOccupation(int occupationId, int companionId)
        {
            OccupationId = occupationId;
            CompanionId = companionId;
        }
        
        public int CompanionId { get; set; } public Companion Companion { get; set; } = null!;
        public int OccupationId { get; set; } public Occupation Occupation { get; set; } = null!;
    }

    public class Companion : BaseCodeEntity
    {
        public Companion() { }
        
        public int? Age { get; set; }
        public string? Sex { get; set; }
        public string? Address { get; set; }
        public string? HomePhone { get; set; }
        public string? PhoneNumber { get; set; }
        public string? Email { get; set; }

        public CompanionRelativeType CompanionRelativeType { get; set; } = null!;
        public CompanionOccupation CompanionOccupation { get; set; } = null!;
        public MedicalRecordCompanion MedicalRecordCompanion { get; set; } = null!;
        

        public OptionDto GetSex() =>
            Sex switch
            {
                "Masculino" => new(1, "Masculino", "Masculino"),
                "Femenino" => new(2, "Femenino", "Femenino"),
                _ => new(3, "unknown", "Desconocido"),
            };
    }

    public class MedicalRecordPersonalDisease {
        public int MedicalRecordId { get; set; } public MedicalRecord MedicalRecord { get; set; } = null!;
        public int DiseaseId { get; set; } public Disease Disease { get; set; } = null!;

        public string? Description { get; set; }
        public string? Other { get; set; }
    }

    

    public class MedicalRecordFamilyDisease {
        public int Id { get; set; }
        
        public int MedicalRecordId { get; set; } public MedicalRecord MedicalRecord { get; set; } = null!;
        public int DiseaseId { get; set; } public Disease Disease { get; set; } = null!;
        public int RelativeTypeId { get; set; } public RelativeType RelativeType { get; set; } = null!;

        public string? Description { get; set; }
        public string? Other { get; set; }
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
        public MedicalRecordDiseaseTypeDisease MedicalRecordDiseaseTypeDisease { get; set; } = null!;
    }

    public class MedicalRecordDiseaseTypeDisease
    {
        public int MedicalRecordDiseaseTypeId { get; set; } public MedicalRecordDiseaseType MedicalRecordDiseaseType { get; set; } = null!;
        public int DiseaseId { get; set; } public Disease Disease { get; set; } = null!;
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
        public ConsumptionLevel() {}
        public ConsumptionLevel(string code) : base(code) { }
        public ConsumptionLevel(string code, string name) : base(code, name) { }
        public ConsumptionLevel(string code, string name, string description) : base(code, name, description) { }

        public List<MedicalRecordSubstance> MedicalRecordSubstances { get; set; } = [];
    }

    

    public class MedicalRecordSubstance {
        public int Id { get; set; }
        
        public int MedicalRecordId { get; set; } public MedicalRecord MedicalRecord { get; set; } = null!;
        public int SubstanceId { get; set; } public Substance Substance { get; set; } = null!;
        public int ConsumptionLevelId { get; set; } public ConsumptionLevel ConsumptionLevel { get; set; } = null!;

        public int? StartAge { get; set; }
        public int? EndAge { get; set; }
        public bool IsCurrent { get; set; } = false;

        public string? Other { get; set; }
    }

    


    public class Substance : BaseCodeEntity {
        public Substance() { }
        public Substance(string code) : base(code) { }
        public Substance(string code, string name) : base(code, name) { }
        public Substance(string code, string name, string description) : base(code, name, description) { }
        
        public List<MedicalRecordSubstance> MedicalRecordSubstances { get; set; } = [];
    }
}

using MainService.Models.Entities.Aggregate;

namespace MainService.Models.Entities
{
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
}


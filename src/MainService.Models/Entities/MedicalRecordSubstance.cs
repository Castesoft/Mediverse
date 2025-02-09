namespace MainService.Models.Entities
{
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
}
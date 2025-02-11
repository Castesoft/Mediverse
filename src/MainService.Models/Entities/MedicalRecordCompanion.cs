namespace MainService.Models.Entities
{
    public class MedicalRecordCompanion
    {
        public MedicalRecordCompanion() { }
        public MedicalRecordCompanion(Companion companion) => Companion = companion;
        public int MedicalRecordId { get; set; }
        public MedicalRecord MedicalRecord { get; set; } = null!;
        public int CompanionId { get; set; }
        public Companion Companion { get; set; } = null!;
    }
}
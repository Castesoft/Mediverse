namespace MainService.Models.Entities
{
    public class MedicalRecordColorBlindness
    {
        public MedicalRecordColorBlindness() { }
        public MedicalRecordColorBlindness(ColorBlindness colorBlindness) => ColorBlindness = colorBlindness;
        public MedicalRecordColorBlindness(int colorBlindnessId) => ColorBlindnessId = colorBlindnessId;

        public int MedicalRecordId { get; set; }
        public MedicalRecord MedicalRecord { get; set; } = null!;
        public int ColorBlindnessId { get; set; }
        public ColorBlindness ColorBlindness { get; set; } = null!;

        public string? Other { get; set; }
        public bool IsPresent { get; set; }
    }
}
namespace MainService.Models.Entities
{
    public class MedicalRecordPersonalDisease
    {
        public MedicalRecordPersonalDisease() { }
        public MedicalRecordPersonalDisease(Disease disease) => Disease = disease;
        public int MedicalRecordId { get; set; }
        public MedicalRecord MedicalRecord { get; set; } = null!;
        public int DiseaseId { get; set; }
        public Disease Disease { get; set; } = null!;

        public string? Description { get; set; }
        public string? Other { get; set; }
    }
}
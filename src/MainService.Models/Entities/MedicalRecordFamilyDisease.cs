namespace MainService.Models.Entities
{
    public class MedicalRecordFamilyDisease
    {
        public int Id { get; set; }

        public int MedicalRecordId { get; set; }
        public MedicalRecord MedicalRecord { get; set; } = null!;
        public int DiseaseId { get; set; }
        public Disease Disease { get; set; } = null!;
        public int RelativeTypeId { get; set; }
        public RelativeType RelativeType { get; set; } = null!;

        public string? Description { get; set; }
        public string? Other { get; set; }
    }
}
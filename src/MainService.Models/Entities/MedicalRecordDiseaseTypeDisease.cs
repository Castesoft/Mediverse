namespace MainService.Models.Entities
{
    public class MedicalRecordDiseaseTypeDisease
    {
        public int MedicalRecordDiseaseTypeId { get; set; } public MedicalRecordDiseaseType MedicalRecordDiseaseType { get; set; } = null!;
        public int DiseaseId { get; set; } public Disease Disease { get; set; } = null!;
    }
}
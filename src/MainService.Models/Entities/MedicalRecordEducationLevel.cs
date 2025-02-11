namespace MainService.Models.Entities
{
    public class MedicalRecordEducationLevel
    {
        public MedicalRecordEducationLevel() { }
        public MedicalRecordEducationLevel(int educationLevelId) => EducationLevelId = educationLevelId;
        public MedicalRecordEducationLevel(EducationLevel educationLevel) => EducationLevel = educationLevel;
        public MedicalRecordEducationLevel(int educationLevelId, int medicalRecordId)
        {
            EducationLevelId = educationLevelId;
            MedicalRecordId = medicalRecordId;
        }

        public int MedicalRecordId { get; set; }
        public MedicalRecord MedicalRecord { get; set; } = null!;
        public int EducationLevelId { get; set; }
        public EducationLevel EducationLevel { get; set; } = null!;
    }
}
namespace MainService.Models.Entities
{
    public class UserMedicalRecord
    {
        public UserMedicalRecord() { }
        public UserMedicalRecord(MedicalRecord medicalRecord) => MedicalRecord = medicalRecord;
        public UserMedicalRecord(AppUser user, MedicalRecord medicalRecord)
        {
            User = user;
            MedicalRecord = medicalRecord;
        }
        public int UserId { get; set; }
        public AppUser User { get; set; } = null!;
        public int MedicalRecordId { get; set; }
        public MedicalRecord MedicalRecord { get; set; } = null!;
    }
}
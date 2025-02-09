namespace MainService.Models.Entities
{
    public class MedicalRecordMaritalStatus
    {
        public MedicalRecordMaritalStatus() { }
        public MedicalRecordMaritalStatus(MaritalStatus maritalStatus) => MaritalStatus = maritalStatus;
        public MedicalRecordMaritalStatus(int maritalStatusId) => MaritalStatusId = maritalStatusId;
        public MedicalRecordMaritalStatus(int maritalStatusId, int medicalRecordId)
        {
            MaritalStatusId = maritalStatusId;
            MedicalRecordId = medicalRecordId;
        }

        public int MedicalRecordId { get; set; }
        public MedicalRecord MedicalRecord { get; set; } = null!;
        public int MaritalStatusId { get; set; }
        public MaritalStatus MaritalStatus { get; set; } = null!;

        public string? Other { get; set; }
    }
}
namespace MainService.Models.Entities
{
    public class MedicalRecordOccupation
    {
        public MedicalRecordOccupation() { }
        public MedicalRecordOccupation(Occupation occupation) => Occupation = occupation;
        public MedicalRecordOccupation(int occupationId) => OccupationId = occupationId;
        public MedicalRecordOccupation(int occupationId, int medicalRecordId)
        {
            OccupationId = occupationId;
            MedicalRecordId = medicalRecordId;
        }

        public int MedicalRecordId { get; set; }
        public MedicalRecord MedicalRecord { get; set; } = null!;
        public int OccupationId { get; set; }
        public Occupation Occupation { get; set; } = null!;

        public string? Other { get; set; }
    }
}
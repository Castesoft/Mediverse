namespace MainService.Models.Entities
{
    public class MedicalRecordFamilyMember
    {
        public MedicalRecordFamilyMember() { }
        public MedicalRecordFamilyMember(FamilyMember familyMember) => FamilyMember = familyMember;
        public int MedicalRecordId { get; set; }
        public MedicalRecord MedicalRecord { get; set; } = null!;
        public int FamilyMemberId { get; set; }
        public FamilyMember FamilyMember { get; set; } = null!;
    }
}
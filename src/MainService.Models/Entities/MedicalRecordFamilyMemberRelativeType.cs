namespace MainService.Models.Entities
{
    public class MedicalRecordFamilyMemberRelativeType
    {
        public MedicalRecordFamilyMemberRelativeType() { }
        public MedicalRecordFamilyMemberRelativeType(RelativeType relativeType) => RelativeType = relativeType;
        public MedicalRecordFamilyMemberRelativeType(int relativeTypeId) => RelativeTypeId = relativeTypeId;
        public MedicalRecordFamilyMemberRelativeType(int relativeTypeId, int familyMemberId)
        {
            RelativeTypeId = relativeTypeId;
            FamilyMemberId = familyMemberId;
        }

        public int FamilyMemberId { get; set; }
        public FamilyMember FamilyMember { get; set; } = null!;
        public int RelativeTypeId { get; set; }
        public RelativeType RelativeType { get; set; } = null!;
    }
}
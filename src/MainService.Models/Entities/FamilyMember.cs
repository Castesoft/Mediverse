namespace MainService.Models.Entities
{
    public class FamilyMember
    {
        public int Id { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public int? Age { get; set; }
        public string? Name { get; set; }

        public MedicalRecordFamilyMember MedicalRecordFamilyMember { get; set; } = null!;
        public MedicalRecordFamilyMemberRelativeType MedicalRecordFamilyMemberRelativeType { get; set; } = null!;
    }
}
namespace MainService.Models.Entities
{
    public class RelativeType : BaseCodeEntity
    {
        public RelativeType()
        {
        }

        public RelativeType(string text) : base(text)
        {
        }

        public RelativeType(int codeNumber) : base(codeNumber)
        {
        }

        public RelativeType(int codeNumber, string text) : base(codeNumber, text)
        {
        }

        public RelativeType(string code, string text) : base(code, text)
        {
        }

        public RelativeType(int codeNumber, string name, string description) : base(codeNumber, name, description)
        {
        }

        public RelativeType(string code, string name, string description) : base(code, name, description)
        {
        }

        public RelativeType(string code, string text, bool visible) : base(code, text, visible)
        {
        }

        public RelativeType(string code, string name, string description, bool enabled, bool visible) : base(code, name, description, enabled, visible)
        {
        }

        public List<MedicalRecordFamilyMemberRelativeType> MedicalRecordFamilyMemberRelativeTypes { get; set; } = [];
        public List<CompanionRelativeType> CompanionRelativeTypes { get; set; } = [];
        public List<MedicalRecordFamilyDisease> MedicalRecordFamilyDiseases { get; set; } = [];
    }
}
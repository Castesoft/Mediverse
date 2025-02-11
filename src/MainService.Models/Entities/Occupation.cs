namespace MainService.Models.Entities
{
    public class Occupation : BaseCodeEntity
    {
        public Occupation()
        {
        }

        public Occupation(string text) : base(text)
        {
        }

        public Occupation(int codeNumber) : base(codeNumber)
        {
        }

        public Occupation(int codeNumber, string text) : base(codeNumber, text)
        {
        }

        public Occupation(string code, string text) : base(code, text)
        {
        }

        public Occupation(int codeNumber, string name, string description) : base(codeNumber, name, description)
        {
        }

        public Occupation(string code, string name, string description) : base(code, name, description)
        {
        }

        public Occupation(string code, string text, bool visible) : base(code, text, visible)
        {
        }

        public Occupation(string code, string name, string description, bool enabled, bool visible) : base(code, name, description, enabled, visible)
        {
        }

        public List<MedicalRecordOccupation> MedicalRecordOccupations { get; set; } = [];
        public List<CompanionOccupation> CompanionOccupations { get; set; } = [];
    }
}
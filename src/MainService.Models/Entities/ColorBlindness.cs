namespace MainService.Models.Entities
{
    public class ColorBlindness : BaseCodeEntity
    {
        public ColorBlindness()
        {
        }

        public ColorBlindness(string text) : base(text)
        {
        }

        public ColorBlindness(int codeNumber) : base(codeNumber)
        {
        }

        public ColorBlindness(int codeNumber, string text) : base(codeNumber, text)
        {
        }

        public ColorBlindness(string code, string text) : base(code, text)
        {
        }

        public ColorBlindness(string code, string name, string description) : base(code, name, description) { }

        public ColorBlindness(int codeNumber, string name, string description) : base(codeNumber, name, description)
        {
        }

        public ColorBlindness(string code, string text, bool visible) : base(code, text, visible)
        {
        }

        public ColorBlindness(string code, string name, string description, bool enabled, bool visible) : base(code, name, description, enabled, visible)
        {
        }

        public List<MedicalRecordColorBlindness> MedicalRecordColorBlindnesses { get; set; } = [];
    }
}
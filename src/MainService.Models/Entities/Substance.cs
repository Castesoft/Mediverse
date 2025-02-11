
namespace MainService.Models.Entities
{
    public class Substance : BaseCodeEntity {
        public Substance()
        {
        }

        public Substance(string text) : base(text)
        {
        }

        public Substance(int codeNumber) : base(codeNumber)
        {
        }

        public Substance(int codeNumber, string text) : base(codeNumber, text)
        {
        }

        public Substance(string code, string text) : base(code, text)
        {
        }

        public Substance(int codeNumber, string name, string description) : base(codeNumber, name, description)
        {
        }

        public Substance(string code, string name, string description) : base(code, name, description)
        {
        }

        public Substance(string code, string text, bool visible) : base(code, text, visible)
        {
        }

        public Substance(string code, string name, string description, bool enabled, bool visible) : base(code, name, description, enabled, visible)
        {
        }

        public List<MedicalRecordSubstance> MedicalRecordSubstances { get; set; } = [];
    }
}
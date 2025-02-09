namespace MainService.Models.Entities
{
    public class ConsumptionLevel : BaseCodeEntity
    {
        public ConsumptionLevel()
        {
        }

        public ConsumptionLevel(string text) : base(text)
        {
        }

        public ConsumptionLevel(int codeNumber) : base(codeNumber)
        {
        }

        public ConsumptionLevel(int codeNumber, string text) : base(codeNumber, text)
        {
        }

        public ConsumptionLevel(string code, string text) : base(code, text)
        {
        }

        public ConsumptionLevel(int codeNumber, string name, string description) : base(codeNumber, name, description)
        {
        }

        public ConsumptionLevel(string code, string name, string description) : base(code, name, description)
        {
        }

        public ConsumptionLevel(string code, string text, bool visible) : base(code, text, visible)
        {
        }

        public ConsumptionLevel(string code, string name, string description, bool enabled, bool visible) : base(code, name, description, enabled, visible)
        {
        }

        public List<MedicalRecordSubstance> MedicalRecordSubstances { get; set; } = [];
    }
}
using MainService.Models.Entities.Aggregate;

namespace MainService.Models.Entities
{
    public class Companion : BaseCodeEntity
    {
        public Companion()
        {
        }

        public Companion(string text) : base(text)
        {
        }

        public Companion(int codeNumber) : base(codeNumber)
        {
        }

        public Companion(int codeNumber, string text) : base(codeNumber, text)
        {
        }

        public Companion(string code, string text) : base(code, text)
        {
        }

        public Companion(int codeNumber, string name, string description) : base(codeNumber, name, description)
        {
        }

        public Companion(string code, string name, string description) : base(code, name, description)
        {
        }

        public Companion(string code, string text, bool visible) : base(code, text, visible)
        {
        }

        public Companion(string code, string name, string description, bool enabled, bool visible) : base(code, name, description, enabled, visible)
        {
        }

        public int? Age { get; set; }
        public string? Sex { get; set; }
        public string? Address { get; set; }
        public string? HomePhone { get; set; }
        public string? PhoneNumber { get; set; }
        public string? Email { get; set; }

        public CompanionRelativeType CompanionRelativeType { get; set; } = null!;
        public CompanionOccupation CompanionOccupation { get; set; } = null!;
        public MedicalRecordCompanion MedicalRecordCompanion { get; set; } = null!;
        

        public OptionDto GetSex() =>
            Sex switch
            {
                "Masculino" => new(1, "Masculino", "Masculino"),
                "Femenino" => new(2, "Femenino", "Femenino"),
                _ => new(3, "unknown", "Desconocido"),
            };
    }
}
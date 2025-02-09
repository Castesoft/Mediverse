
namespace MainService.Models.Entities
{
    public class MaritalStatus : BaseCodeEntity
    {
        public MaritalStatus()
        {
        }

        public MaritalStatus(string text) : base(text)
        {
        }

        public MaritalStatus(int codeNumber) : base(codeNumber)
        {
        }

        public MaritalStatus(int codeNumber, string text) : base(codeNumber, text)
        {
        }

        public MaritalStatus(string code, string text) : base(code, text)
        {
        }

        public MaritalStatus(int codeNumber, string name, string description) : base(codeNumber, name, description)
        {
        }

        public MaritalStatus(string code, string name, string description) : base(code, name, description)
        {
        }

        public MaritalStatus(string code, string text, bool visible) : base(code, text, visible)
        {
        }

        public MaritalStatus(string code, string name, string description, bool enabled, bool visible) : base(code, name, description, enabled, visible)
        {
        }

        public List<MedicalRecordMaritalStatus> MedicalRecordMaritalStatuses { get; set; } = [];
    }
}
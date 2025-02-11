
namespace MainService.Models.Entities
{
    public class EducationLevel : BaseCodeEntity
    {
        public EducationLevel()
        {
        }

        public EducationLevel(string text) : base(text)
        {
        }

        public EducationLevel(int codeNumber) : base(codeNumber)
        {
        }

        public EducationLevel(int codeNumber, string text) : base(codeNumber, text)
        {
        }

        public EducationLevel(string code, string text) : base(code, text)
        {
        }

        public EducationLevel(int codeNumber, string name, string description) : base(codeNumber, name, description)
        {
        }

        public EducationLevel(string code, string name, string description) : base(code, name, description)
        {
        }

        public EducationLevel(string code, string text, bool visible) : base(code, text, visible)
        {
        }

        public EducationLevel(string code, string name, string description, bool enabled, bool visible) : base(code, name, description, enabled, visible)
        {
        }

        // Navigation Properties
        public List<MedicalRecordEducationLevel> MedicalRecordEducationLevels { get; set; } = [];
    }
}
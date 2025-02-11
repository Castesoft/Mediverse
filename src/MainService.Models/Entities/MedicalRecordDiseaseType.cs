
namespace MainService.Models.Entities
{
    public class MedicalRecordDiseaseType : BaseCodeEntity
    {
        public MedicalRecordDiseaseType()
        {
        }

        public MedicalRecordDiseaseType(string text) : base(text)
        {
        }

        public MedicalRecordDiseaseType(int codeNumber) : base(codeNumber)
        {
        }

        public MedicalRecordDiseaseType(int codeNumber, string text) : base(codeNumber, text)
        {
        }

        public MedicalRecordDiseaseType(string code, string text) : base(code, text)
        {
        }

        public MedicalRecordDiseaseType(int codeNumber, string name, string description) : base(codeNumber, name, description)
        {
        }

        public MedicalRecordDiseaseType(string code, string name, string description) : base(code, name, description)
        {
        }

        public MedicalRecordDiseaseType(string code, string text, bool visible) : base(code, text, visible)
        {
        }

        public MedicalRecordDiseaseType(string code, string name, string description, bool enabled, bool visible) : base(code, name, description, enabled, visible)
        {
        }

        public List<MedicalRecordPersonalDisease> MedicalRecordPersonalDiseases { get; set; } = [];
        public MedicalRecordDiseaseTypeDisease MedicalRecordDiseaseTypeDisease { get; set; } = null!;
    }
}
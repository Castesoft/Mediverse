
namespace MainService.Models.Entities
{
    public class Disease : BaseCodeEntity
    {
        public Disease() { }
        public Disease(string code) : base(code) { }
        public Disease(string code, string name) : base(code, name) { }
        public Disease(string code, string name, string description) : base(code, name, description) { }

        public List<MedicalRecordPersonalDisease> MedicalRecordPersonalDiseases { get; set; } = [];
        public List<MedicalRecordFamilyDisease> MedicalRecordFamilyDiseases { get; set; } = [];
    }
}
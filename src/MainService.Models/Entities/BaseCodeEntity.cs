namespace MainService.Models.Entities
{
    public class BaseCodeEntity
    {
        public BaseCodeEntity() {}

        public BaseCodeEntity(string text) {
            Name = text;
            Code = text;
            Description = text;
        }

        public BaseCodeEntity(int codeNumber) {
            CodeNumber = codeNumber;
            Name = codeNumber.ToString();
            Code = codeNumber.ToString();
            Description = codeNumber.ToString();
        }

        public BaseCodeEntity(int codeNumber, string text) {
            CodeNumber = codeNumber;
            Name = text;
            Code = codeNumber.ToString();
            Description = text;
        }
        
        public BaseCodeEntity(int codeNumber, string name, string description) {
            CodeNumber = codeNumber;
            Name = name;
            Code = codeNumber.ToString();
            Description = description;
        }
        
        public BaseCodeEntity(string code, string text) {
            Name = text;
            Code = code;
            Description = text;
        }

        public BaseCodeEntity(string code, string name, string description) {
            Name = name;
            Code = code;
            Description = description;
        }

        public BaseCodeEntity(string code, string text, bool visible) {
            Name = text;
            Code = code;
            Description = text;
            Visible = visible;
        }

        public BaseCodeEntity(
            string code,
            string name,
            string description,
            bool enabled,
            bool visible
        ) {
            Code = code;
            Name = name;
            Description = description;
            Enabled = enabled;
            Visible = visible;
        }
        
        public int Id { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public string? Code { get; set; }
        public int? CodeNumber { get; set; }
        public string? Name { get; set; }
        public string? Description { get; set; }
        public string? Color { get; set; }
        public string? LastName { get; set; }
        public bool Enabled { get; set; } = true;
        public bool Visible { get; set; } = true;
    }
}
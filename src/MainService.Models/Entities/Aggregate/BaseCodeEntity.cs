namespace MainService.Models.Entities.Aggregate
{
    public class BaseCodeEntity
    {
        public BaseCodeEntity() { }

        public BaseCodeEntity(string text)
        {
            Name = text;
            Code = text;
            Description = text;
        }

        public BaseCodeEntity(int codeNumber)
        {
            CodeNumber = codeNumber;
            Name = codeNumber.ToString();
            Code = codeNumber.ToString();
            Description = codeNumber.ToString();
        }

        public BaseCodeEntity(int codeNumber, string text)
        {
            CodeNumber = codeNumber;
            Name = text;
            Code = codeNumber.ToString();
            Description = text;
        }

        public BaseCodeEntity(string code, string text)
        {
            Name = text;
            Code = code;
            Description = text;
        }

        public BaseCodeEntity(string code, string text, bool visible)
        {
            Name = text;
            Code = code;
            Description = text;
            Visible = visible;
        }

        public int Id { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public string Code { get; set; }
        public int CodeNumber { get; set; } = 0;
        public string Name { get; set; }
        public string Description { get; set; }
        public string Color { get; set; }
        public string LastName { get; set; }
        public bool Enabled { get; set; } = true;
        public bool Visible { get; set; } = true;
    }

    public class BaseCodeParams
    {
        private const int MaxPageSize = 50;
        public int PageNumber { get; set; } = 1;
        private int _pageSize = 10;
        public int PageSize
        {
            get => _pageSize;
            set => _pageSize = (value > MaxPageSize) ? MaxPageSize : value;
        }
        public DateTime DateFrom { get; set; } = DateTime.MinValue;
        public DateTime DateTo { get; set; } = DateTime.MaxValue;
        public string Sort { get; set; }
        public bool IsSortAscending { get; set; }
        public string Code { get; set; }
        public int CodeNumber { get; set; }
        public string Description { get; set; }
        public string Name { get; set; }
        private string _search;
        public string Search
        {
            get => _search;
            set => _search = value.ToLower();
        }
    }
}

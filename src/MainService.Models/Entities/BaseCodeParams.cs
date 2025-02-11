namespace MainService.Models.Entities
{
    public class BaseCodeParams {
        private const int MaxPageSize = 50;
        public int PageNumber { get; set; } = 1;
        private int _pageSize = 10;
        public int PageSize
        {
            get => _pageSize;
            set => _pageSize = (value > MaxPageSize) ? MaxPageSize : value;
        }
        public DateTime? DateFrom { get; set; }
        public DateTime? DateTo { get; set; }
        public string? Sort { get; set; }
        public bool? IsSortAscending { get; set; }
        public string? Code { get; set; }
        public int? CodeNumber { get; set; }
        public string? Description { get; set; }
        public string? Name { get; set; }
        public string? Color { get; set; }
        public string? LastName { get; set; }
        public bool? ForTypeahead { get; set; }
        private string? _search;
        public string? Search
        {
            get => _search;
            set => _search = value?.ToLower();
        }
    }
}
namespace MainService.Core.DTOs.Google
{
    public class GooglePlacesTextSearchResult
    {
        public string? FormattedAddress { get; set; }
        public Geometry? Geometry { get; set; }
        public string? Icon { get; set; }
        public string? IconBackgroundColor { get; set; }
        public string? IconMaskBaseUri { get; set; }
        public string? Name { get; set; }
        public string? PlaceId { get; set; }
        public PlusCode? PlusCode { get; set; }
        public string? Reference { get; set; }
        public List<string> Types { get; set; } = [];
    }
}
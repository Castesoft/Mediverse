namespace MainService.Core.DTOs.Google
{
    public class GooglePlacesTextSearchResponse
    {
        public List<object> HtmlAttributions { get; set; } = [];
        public List<GooglePlacesTextSearchResult> Results { get; set; } = [];
        public string? Status { get; set; }
    }
}
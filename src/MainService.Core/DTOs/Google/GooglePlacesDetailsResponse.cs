namespace MainService.Core.DTOs.Google
{
    public class GooglePlacesDetailsResponse
    {
        public List<object> HtmlAttributions { get; set; } = [];
        public GooglePlacesDetailsResult? Result { get; set; }
        public string? Status { get; set; }
    }
}
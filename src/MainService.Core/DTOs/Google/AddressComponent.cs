namespace MainService.Core.DTOs.Google
{
    public class AddressComponent
    {
        public string? LongName { get; set; }
        public string? ShortName { get; set; }
        public List<string> Types { get; set; } = [];
    }
}
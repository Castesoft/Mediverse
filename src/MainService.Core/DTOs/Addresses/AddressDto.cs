namespace MainService.Core.DTOs.Addresses
{

    public class AddressDto : BaseAddressDto
    {
        public string? Description { get; set; }

        public int? NursesCount { get; set; }
        public string? PhotoUrl { get; set; }
        public bool IsMain { get; set; }
    }

    public class ZipcodeAddressOption
    {
        public string? Neighborhood { get; set; }
        public string? City { get; set; }
        public string? State { get; set; }
        public string? Settlement { get; set; }
    }
}
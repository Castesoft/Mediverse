namespace MainService.Core.DTOs.User
{
    public class UserAddressUpdateDto
    {
        public bool IsMain { get; set; }
        public bool IsBilling { get; set; }
        public string Address { get; set; }
        public string City { get; set; }
        public string State { get; set; }
        public string Country { get; set; }
        public string ZipCode { get; set; }
    }
}
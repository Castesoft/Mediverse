namespace MainService.Core.DTOs.User
{
    public class UserAddressDto
    {
        public bool IsMain { get; set; }
        public bool IsBilling { get; set; }
        public string Street { get; set; }
        public string City { get; set; }
        public string State { get; set; }
        public string Country { get; set; }
        public string Zipcode { get; set; }
    }
}
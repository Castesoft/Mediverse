namespace MainService.Core.DTOs.User
{
    public class UserPaymentMethodDto
    {
        public bool IsMain { get; set; }
        public string DisplayName { get; set; }
        public string Last4 { get; set; }
        public string Brand { get; set; }
        public string Country { get; set; }
        public int ExpirationMonth { get; set; }
        public int ExpirationYear { get; set; }
    }
}
namespace MainService.Core.DTOs.User
{
    public class BillingDetailsDto
    {
        public List<UserAddressDto> UserAddresses { get; set; }
        public List<UserPaymentMethodDto> UserPaymentMethods { get; set; }
    }
}
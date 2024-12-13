namespace MainService.Core.DTOs.User
{
    public class AccountDetailsUpdateDto
    {
        public string? FirstName { get; set; }
        public string? LastName { get; set; }
        public string? PhoneNumber { get; set; }
        public string? SpecialtyId { get; set; }
        // public int SubSpecialtyId { get; set; }
        public string? AcceptedPaymentMethods { get; set; }
        public bool RequireAnticipatedCardPayments { get; set; }
        public bool RemoveAvatar { get; set; } = false;
    }
}
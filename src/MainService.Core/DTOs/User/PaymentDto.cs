namespace MainService.Core.DTOs.User
{
    public class PaymentDto
    {
        public int Id { get; set; }
        public decimal Amount { get; set; }
        public DateTime PaymentDate { get; set; }
        public UserPaymentMethodDto PaymentMethod { get; set; }
        public PaymentMethodTypeDto PaymentMethodType { get; set; }
    }
}
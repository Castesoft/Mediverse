namespace MainService.Models.Entities;
public class UserPaymentMethod
{
    public UserPaymentMethod() { }

    public UserPaymentMethod(int userId, int paymentMethodId, bool isMain)
    {
        UserId = userId;
        PaymentMethodId = paymentMethodId;
        IsMain = isMain;
    }
    
    public int UserId { get; set; }
    public int PaymentMethodId { get; set; }
    public AppUser User { get; set; }
    public PaymentMethod PaymentMethod { get; set; }

    public bool IsMain { get; set; } = false;
}
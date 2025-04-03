namespace MainService.Models.Entities;

public class PaymentMethodPreference : BaseEntity
{
    public int UserId { get; set; }
    public int PaymentMethodTypeId { get; set; }
    public int DisplayOrder { get; set; }
    public bool IsDefault { get; set; }
    public bool IsActive { get; set; } = true;
    public AppUser User { get; set; } = null!;
    public PaymentMethodType PaymentMethodType { get; set; } = null!;
}
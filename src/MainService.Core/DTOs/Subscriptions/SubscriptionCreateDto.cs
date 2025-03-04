using System.ComponentModel.DataAnnotations;

namespace MainService.Core.DTOs.Subscriptions;

public class SubscriptionCreateDto
{
    [Required(ErrorMessage = "Payment Method ID is required.")]
    public required int PaymentMethodId { get; set; }
    
    [Required(ErrorMessage = "Billing Address ID is required.")]
    public required int BillingAddressId { get; set; }
}
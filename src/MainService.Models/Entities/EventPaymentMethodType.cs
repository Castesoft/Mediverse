namespace MainService.Models.Entities;

public class EventPaymentMethodType
{
    public EventPaymentMethodType() {}
    
    public EventPaymentMethodType(int paymentMethodTypeId) => PaymentMethodTypeId = paymentMethodTypeId;
    
    public int EventId { get; set; }
    public int PaymentMethodTypeId { get; set; }
    public Event Event { get; set; }
    public PaymentMethodType PaymentMethodType { get; set; }
}
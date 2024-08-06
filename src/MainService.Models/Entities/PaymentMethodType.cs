namespace MainService.Models.Entities;
public class PaymentMethodType : BaseEntity
{
    public ICollection<DoctorPaymentMethodType> DoctorPaymentMethodTypes { get; set; } = [];
}
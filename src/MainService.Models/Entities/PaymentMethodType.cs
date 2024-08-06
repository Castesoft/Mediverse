using System.ComponentModel.DataAnnotations.Schema;

namespace MainService.Models.Entities;

[Table("PaymentMethodTypes")]
public class PaymentMethodType : BaseEntity
{
    public ICollection<DoctorPaymentMethodType> DoctorPaymentMethodTypes { get; set; } = [];
}
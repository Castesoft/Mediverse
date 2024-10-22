using System.ComponentModel.DataAnnotations.Schema;
using MainService.Models.Entities.Aggregate;

namespace MainService.Models.Entities;

[Table("PaymentMethodTypes")]
public class PaymentMethodType : BaseCodeEntity
{
    public List<DoctorPaymentMethodType> DoctorPaymentMethodTypes { get; set; } = [];
    public List<EventPaymentMethodType> EventPaymentMethodTypes { get; set; } = [];
    public List<PaymentPaymentMethodType> PaymentPaymentMethodTypes { get; set; } = [];
}

public class PaymentMethodTypeDto : BaseCodeEntity {}
public class PaymentMethodTypeParams : BaseCodeParams {}
public class PaymentMethodTypeCreateDto : BaseCodeManageDto {}
public class PaymentMethodTypeUpdateDto : BaseCodeManageDto {}

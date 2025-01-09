namespace MainService.Models.Entities;

public class Order : BaseEntity
{
    public decimal? Total { get; set; }
    public decimal? Subtotal { get; set; }
    public double? Discount { get; set; }
    public decimal? Tax { get; set; }
    public decimal? AmountPaid { get; set; }
    public decimal? AmountDue { get; set; }

    public PrescriptionOrder PrescriptionOrder { get; set; } = null!;
    public PatientOrder PatientOrder { get; set; } = null!;
    public DoctorOrder DoctorOrder { get; set; } = null!;
    public OrderDeliveryAddress? OrderDeliveryAddress { get; set; }
    public OrderPickupAddress? OrderPickupAddress { get; set; }
    public List<OrderItem> OrderItems { get; set; } = [];
    
    public OrderOrderStatus OrderOrderStatus { get; set; } = null!;
    public OrderDeliveryStatus OrderDeliveryStatus { get; set; } = null!;
}

namespace MainService.Models.Entities;

public class Order : BaseEntity
{
    public decimal Total { get; set; }
    public decimal Subtotal { get; set; }
    public double Discount { get; set; }
    public decimal Tax { get; set; }

    public decimal AmountPaid { get; set; }
    public decimal AmountDue { get; set; }

    public PrescriptionOrder PrescriptionOrder { get; set; }
    public PatientOrder PatientOrder { get; set; }
    public DoctorOrder DoctorOrder { get; set; }
    public OrderAddress OrderAddress { get; set; }
    public List<OrderItem> OrderItems { get; set; } = [];
    public SaleStatus Status { get; set; } = SaleStatus.Pending;
    public SaleDeliveryStatus DeliveryStatus { get; set; } = SaleDeliveryStatus.Pending;
}

public enum SaleStatus
{
    Pending,
    Completed,
    Cancelled
}

public enum SaleDeliveryStatus
{
    Pending,
    InProgress,
    Delivered,
    Cancelled
}
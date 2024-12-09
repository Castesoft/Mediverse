using System.Runtime.Serialization;

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
    public OrderAddress OrderAddress { get; set; } = null!;
    public List<OrderItem> OrderItems { get; set; } = [];
    
    public OrderStatus Status { get; set; } = OrderStatus.Pending;
    public OrderDeliveryStatus DeliveryStatus { get; set; } = OrderDeliveryStatus.Pending;
}

public enum OrderStatus
{
    [EnumMember(Value = "pending")] Pending,
    [EnumMember(Value = "completed")] Completed,
    [EnumMember(Value = "cancelled")] Cancelled
}

public enum OrderDeliveryStatus
{
    [EnumMember(Value = "pending")] Pending,
    [EnumMember(Value = "processing")] Processing,
    [EnumMember(Value = "inprogress")] InProgress,
    [EnumMember(Value = "delivered")] Delivered,
    [EnumMember(Value = "cancelled")] Cancelled
}
using System.ComponentModel;
using System.Runtime.Serialization;
using MainService.Core.DTOs.Addresses;
using MainService.Core.DTOs.Prescription;
using MainService.Core.DTOs.User;
using MainService.Models.Entities;

namespace MainService.Core.DTOs.Orders;

public class OrderDto : BaseEntity
{
    public decimal Total { get; set; }
    public decimal Subtotal { get; set; }
    public double Discount { get; set; }
    public decimal Tax { get; set; }

    public decimal AmountPaid { get; set; }
    public decimal AmountDue { get; set; }

    public UserDto Patient { get; set; }
    public UserDto Doctor { get; set; }
    public AddressDto Address { get; set; }
    public List<PrescriptionItemDto> Items { get; set; } = [];
    public SaleStatus Status { get; set; } = SaleStatus.Pending;
    public SaleDeliveryStatus DeliveryStatus { get; set; } = SaleDeliveryStatus.Pending;
}

public enum SaleStatus
{
    [EnumMember(Value = "Pending")] Pending,
    [EnumMember(Value = "Completed")] Completed,
    [EnumMember(Value = "Cancelled")] Cancelled
}

public enum SaleDeliveryStatus
{
    [EnumMember(Value = "Pending")] Pending,
    [EnumMember(Value = "InProgress")] InProgress,
    [EnumMember(Value = "Delivered")] Delivered,
    [EnumMember(Value = "Cancelled")] Cancelled
}
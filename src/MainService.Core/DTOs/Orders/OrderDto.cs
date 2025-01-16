using MainService.Core.DTOs.Addresses;
using MainService.Core.DTOs.User;
using MainService.Models.Entities;
using MainService.Models.Entities.Aggregate;

namespace MainService.Core.DTOs.Orders;

public class OrderDto : BaseEntity
{
    public decimal? Total { get; set; }
    public decimal? Subtotal { get; set; }
    public double? Discount { get; set; }
    public decimal? Tax { get; set; }

    public decimal? AmountPaid { get; set; }
    public decimal? AmountDue { get; set; }

    public UserDto? Patient { get; set; }
    public UserDto? Doctor { get; set; }
    public OptionDto? PickupAddress { get; set; }
    public OptionDto? DeliveryAddress { get; set; }
    public List<OrderItemDto> Items { get; set; } = [];
    public OptionDto? Status { get; set; }
    public OptionDto? DeliveryStatus { get; set; }
}
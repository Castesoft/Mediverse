using MainService.Models.Entities;

namespace MainService.Core.DTOs.Orders;

public class OrderUpdateDto
{
    public string Status { get; set; }
    public string DeliveryStatus { get; set; }
}
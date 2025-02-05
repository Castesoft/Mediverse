using MainService.Core.DTOs.Orders;
using MainService.Models.Entities;

namespace MainService.Core.Interfaces.Services
{
    public interface IOrdersService
    {
        Task<Order> CreateAsync(List<OrderItem> items, int customerId, int doctorId);
        Task<OrderDto?> UpdateAsync(OrderUpdateDto request, int orderId, int userId);
    }
}
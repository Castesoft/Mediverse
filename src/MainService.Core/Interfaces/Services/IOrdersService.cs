

using MainService.Models.Entities;

namespace MainService.Core.Interfaces.Services
{
    public interface IOrdersService
    {
        Task<Order> CreateAsync(List<OrderItem> items, int customerId, int doctorId);
    }
}
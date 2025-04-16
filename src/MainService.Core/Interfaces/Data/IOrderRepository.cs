using MainService.Core.DTOs.Orders;
using MainService.Core.Helpers.Pagination;
using MainService.Core.Helpers.Params;
using MainService.Models.Entities;

namespace MainService.Core.Interfaces.Data;
public interface IOrderRepository
{
    void Add(Order item);
    void Delete(Order item);
    Task<Order?> GetByIdAsync(int id);
    Task<bool> ExistsByIdAsync(int id);
    Task<OrderDto?> GetDtoByIdAsync(int id);
    Task<Order?> GetByIdAsNoTrackingAsync(int id);
    Task<List<OrderHistoryDto>> GetHistoryByIdAsync(int orderId);
    Task<List<Order>> GetAllAsync();
    Task<List<OrderDto>> GetAllDtoAsync(OrderParams param);
    Task<PagedList<OrderDto>> GetPagedListAsync(OrderParams param);
    Task<Order?> GetOrderWithItemsAndProductsAsync(int orderId);
}
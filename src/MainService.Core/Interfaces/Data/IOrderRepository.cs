using System.Security.Claims;
using MainService.Core.DTOs.Orders;
using MainService.Core.Helpers.Pagination;
using MainService.Core.Helpers.Params;
using MainService.Models.Entities;

namespace MainService.Core.Interfaces.Data;
public interface IOrderRepository
{
    void Add(Order item);
    void Delete(Order item);
    Task<Order> GetByIdAsync(int id);
    Task<Order> GetByNameAsync(string name, ClaimsPrincipal user);
    Task<bool> ExistsAsync(int id, ClaimsPrincipal user);
    Task<OrderDto> GetDtoByIdAsync(int id);
    Task<Order> GetByIdAsNoTrackingAsync(int id);
    Task<List<Order>> GetAllAsync();
    Task<List<OrderDto>> GetAllDtoAsync(OrderParams param, ClaimsPrincipal user);
    Task<PagedList<OrderDto>> GetPagedListAsync(OrderParams param, ClaimsPrincipal user);
}
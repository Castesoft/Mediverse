using MainService.Core.DTOs.OrderStatuses;
using MainService.Core.Helpers.Pagination;
using MainService.Core.Helpers.Params;
using MainService.Models.Entities;
using MainService.Models.Entities.Aggregate;

namespace MainService.Core.Interfaces.Data
{
    public interface IOrderStatusRepository
    {
        Task<OrderStatus?> GetByIdAsync(int id);
        Task<List<OptionDto>> GetOptionsAsync();
        Task<bool> ExistsByIdAsync(int id);
        Task<bool> ExistsByNameAsync(string name);
        Task<bool> ExistsByCodeAsync(string code);
        Task<List<OrderStatusDto>> GetAllDtosAsync();
        Task<PagedList<OrderStatusDto>> GetPagedListAsync(OrderStatusParams param, bool getAll = false);
        Task<OrderStatusDto?> GetDtoByIdAsync(int id);
        Task<OrderStatus?> GetAsNoTrackingByIdAsync(int id);
        Task<OrderStatusDto?> FindDtoByNameAsync(string name);
        Task<OrderStatus?> GetByNameAsync(string name);
        Task<OrderStatus?> GetByCodeAsync(string code);
        void Add(OrderStatus item);
        void Delete(OrderStatus item);
    }
}
using MainService.Core.DTOs.DeliveryStatuses;
using MainService.Core.Helpers.Pagination;
using MainService.Core.Helpers.Params;
using MainService.Models.Entities;
using MainService.Models.Entities.Aggregate;

namespace MainService.Core.Interfaces.Data
{
    public interface IDeliveryStatusRepository
    {
        Task<DeliveryStatus?> GetByIdAsync(int id);
        Task<List<OptionDto>> GetOptionsAsync();
        Task<bool> ExistsByIdAsync(int id);
        Task<bool> ExistsByNameAsync(string name);
        Task<bool> ExistsByCodeAsync(string code);
        Task<List<DeliveryStatusDto>> GetAllDtosAsync();
        Task<PagedList<DeliveryStatusDto>> GetPagedListAsync(DeliveryStatusParams param, bool getAll = false);
        Task<DeliveryStatusDto?> GetDtoByIdAsync(int id);
        Task<DeliveryStatus?> GetAsNoTrackingByIdAsync(int id);
        Task<DeliveryStatusDto?> FindDtoByNameAsync(string name);
        Task<DeliveryStatus?> GetByNameAsync(string name);
        Task<DeliveryStatus?> GetByCodeAsync(string code);
        void Add(DeliveryStatus item);
        void Delete(DeliveryStatus item);
    }
}
using MainService.Core.DTOs;
using MainService.Core.Helpers.Pagination;
using MainService.Models.Entities;
using MainService.Models.Entities.Aggregate;

namespace MainService.Core.Interfaces.Data;

public interface IConsumptionLevelRepository
{
    Task<ConsumptionLevel> GetByIdAsync(int id);
    Task<List<OptionDto>> GetOptionsAsync();
    Task<bool> ExistsByIdAsync(int id);
    Task<bool> NameUniqueAsync(string name);
    Task<bool> CodeUniqueAsync(string code);
    Task<List<ConsumptionLevelDto>> GetAllAsNoTrackingAsync();
    Task<PagedList<ConsumptionLevelDto>> GetPagedListAsync(ConsumptionLevelParams param, bool getAll = false);
    Task<ConsumptionLevelDto> GetDtoByIdAsync(int id);
    Task<ConsumptionLevel> GetAsNoTrackingByIdAsync(int id);
    Task<ConsumptionLevelDto> FindDtoByNameAsync(string name);
    Task<ConsumptionLevel> GetByNameAsync(string name);
    void Add(ConsumptionLevel item);
    void Delete(ConsumptionLevel item);
}

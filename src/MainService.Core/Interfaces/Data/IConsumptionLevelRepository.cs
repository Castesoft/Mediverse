using MainService.Core.DTOs.MedicalRecord;
using MainService.Core.Helpers.Pagination;
using MainService.Models.Entities;
using MainService.Models.Entities.Aggregate;

namespace MainService.Core.Interfaces.Data;

public interface IConsumptionLevelRepository
{
    Task<ConsumptionLevel?> GetByIdAsync(int id);
    Task<List<OptionDto>> GetOptionsAsync();
    Task<bool> ExistsByIdAsync(int id);
    Task<bool> ExistsByNameAsync(string name);
    Task<bool> ExistsByCodeAsync(string code);
    Task<List<ConsumptionLevelDto>> GetAllDtosAsync();
    Task<PagedList<ConsumptionLevelDto>> GetPagedListAsync(ConsumptionLevelParams param, bool getAll = false);
    Task<ConsumptionLevelDto?> GetDtoByIdAsync(int id);
    Task<ConsumptionLevel?> GetAsNoTrackingByIdAsync(int id);
    Task<ConsumptionLevelDto?> FindDtoByNameAsync(string name);
    Task<ConsumptionLevel?> GetByNameAsync(string name);
    Task<ConsumptionLevel?> GetByCodeAsync(string code);
    void Add(ConsumptionLevel item);
    void Delete(ConsumptionLevel item);
}

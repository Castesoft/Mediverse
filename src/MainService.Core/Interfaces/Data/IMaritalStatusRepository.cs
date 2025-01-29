using MainService.Core.DTOs;
using MainService.Core.DTOs.MedicalRecord;
using MainService.Core.Helpers.Pagination;
using MainService.Models.Entities;
using MainService.Models.Entities.Aggregate;

namespace MainService.Core.Interfaces.Data;

public interface IMaritalStatusRepository
{
    Task<MaritalStatus?> GetByIdAsync(int id);
    Task<List<OptionDto>> GetOptionsAsync();
    Task<bool> ExistsByIdAsync(int id);
    Task<bool> ExistsByNameAsync(string name);
    Task<bool> ExistsByCodeAsync(string code);
    Task<List<MaritalStatusDto>> GetAllDtosAsync();
    Task<PagedList<MaritalStatusDto>> GetPagedListAsync(MaritalStatusParams param, bool getAll = false);
    Task<MaritalStatusDto?> GetDtoByIdAsync(int id);
    Task<MaritalStatus?> GetAsNoTrackingByIdAsync(int id);
    Task<MaritalStatusDto?> FindDtoByNameAsync(string name);
    Task<MaritalStatus?> GetByNameAsync(string name);
    Task<MaritalStatus?> GetByCodeAsync(string code);
    void Add(MaritalStatus item);
    void Delete(MaritalStatus item);
}

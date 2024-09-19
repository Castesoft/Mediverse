using MainService.Core.DTOs;
using MainService.Core.Helpers.Pagination;
using MainService.Models.Entities;
using MainService.Models.Entities.Aggregate;

namespace MainService.Core.Interfaces.Data;

public interface IMaritalStatusRepository
{
    Task<MaritalStatus> GetByIdAsync(int id);
    Task<List<OptionDto>> GetOptionsAsync();
    Task<bool> ExistsByIdAsync(int id);
    Task<bool> NameUniqueAsync(string name);
    Task<bool> CodeUniqueAsync(string code);
    Task<List<MaritalStatusDto>> GetAllAsNoTrackingAsync();
    Task<PagedList<MaritalStatusDto>> GetPagedListAsync(MaritalStatusParams param, bool getAll = false);
    Task<MaritalStatusDto> GetDtoByIdAsync(int id);
    Task<MaritalStatus> GetAsNoTrackingByIdAsync(int id);
    Task<MaritalStatusDto> FindDtoByNameAsync(string name);
    Task<MaritalStatus> GetByNameAsync(string name);
    void Add(MaritalStatus item);
    void Delete(MaritalStatus item);
}

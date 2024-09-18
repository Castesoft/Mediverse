using MainService.Core.DTOs;
using MainService.Core.Helpers.Pagination;
using MainService.Models.Entities;
using MainService.Models.Entities.Aggregate;

namespace MainService.Core.Interfaces.Data;

public interface IOccupationRepository
{
    Task<Occupation> GetByIdAsync(int id);
    Task<List<OptionDto>> GetOptionsAsync();
    Task<bool> ExistsByIdAsync(int id);
    Task<bool> NameUniqueAsync(string name);
    Task<bool> CodeUniqueAsync(string code);
    Task<List<OccupationDto>> GetAllAsNoTrackingAsync();
    Task<PagedList<OccupationDto>> GetPagedListAsync(OccupationParams param, bool getAll = false);
    Task<OccupationDto> GetDtoByIdAsync(int id);
    Task<Occupation> GetAsNoTrackingByIdAsync(int id);
    Task<OccupationDto> FindDtoByNameAsync(string name);
    Task<Occupation> GetByNameAsync(string name);
    void Add(Occupation item);
    void Delete(Occupation item);
}

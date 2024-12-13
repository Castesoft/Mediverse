using MainService.Core.Helpers.Pagination;
using MainService.Models.Entities;
using MainService.Models.Entities.Aggregate;

namespace MainService.Core.Interfaces.Data;
public interface ISpecialtyRepository
{
    Task<Specialty?> GetByIdAsync(int id);
    Task<List<OptionDto>> GetOptionsAsync();
    Task<bool> ExistsByIdAsync(int id);
    Task<bool> ExistsByNameAsync(string name);
    Task<bool> ExistsByCodeAsync(string code);
    Task<List<SpecialtyDto>> GetAllDtosAsync();
    Task<PagedList<SpecialtyDto>> GetPagedListAsync(SpecialtyParams param, bool getAll = false);
    Task<SpecialtyDto?> GetDtoByIdAsync(int id);
    Task<Specialty?> GetAsNoTrackingByIdAsync(int id);
    Task<SpecialtyDto?> FindDtoByNameAsync(string name);
    Task<Specialty?> GetByNameAsync(string name);
    Task<Specialty?> GetByCodeAsync(string code);
    void Add(Specialty item);
    void Delete(Specialty item);
}
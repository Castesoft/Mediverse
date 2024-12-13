using MainService.Core.DTOs;
using MainService.Core.Helpers.Pagination;
using MainService.Models.Entities;
using MainService.Models.Entities.Aggregate;

namespace MainService.Core.Interfaces.Data;

public interface ISubstanceRepository
{
    Task<Substance?> GetByIdAsync(int id);
    Task<List<OptionDto>> GetOptionsAsync();
    Task<bool> ExistsByIdAsync(int id);
    Task<bool> ExistsByNameAsync(string name);
    Task<bool> ExistsByCodeAsync(string code);
    Task<List<SubstanceDto>> GetAllDtosAsync();
    Task<PagedList<SubstanceDto>> GetPagedListAsync(SubstanceParams param, bool getAll = false);
    Task<SubstanceDto?> GetDtoByIdAsync(int id);
    Task<Substance?> GetAsNoTrackingByIdAsync(int id);
    Task<SubstanceDto?> FindDtoByNameAsync(string name);
    Task<Substance?> GetByNameAsync(string name);
    Task<Substance?> GetByCodeAsync(string code);
    void Add(Substance item);
    void Delete(Substance item);
}

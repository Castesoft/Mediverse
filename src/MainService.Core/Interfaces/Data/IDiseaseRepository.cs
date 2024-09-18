using MainService.Core.DTOs;
using MainService.Core.Helpers.Pagination;
using MainService.Models.Entities;
using MainService.Models.Entities.Aggregate;

namespace MainService.Core.Interfaces.Data;

public interface IDiseaseRepository
{
    Task<Disease> GetByIdAsync(int id);
    Task<List<OptionDto>> GetOptionsAsync();
    Task<bool> ExistsByIdAsync(int id);
    Task<bool> NameUniqueAsync(string name);
    Task<bool> CodeUniqueAsync(string code);
    Task<List<DiseaseDto>> GetAllAsNoTrackingAsync();
    Task<PagedList<DiseaseDto>> GetPagedListAsync(DiseaseParams param, bool getAll = false);
    Task<DiseaseDto> GetDtoByIdAsync(int id);
    Task<Disease> GetAsNoTrackingByIdAsync(int id);
    Task<DiseaseDto> FindDtoByNameAsync(string name);
    Task<Disease> GetByNameAsync(string name);
    void Add(Disease item);
    void Delete(Disease item);
}

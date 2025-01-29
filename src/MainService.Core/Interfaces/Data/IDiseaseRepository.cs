using MainService.Core.DTOs;
using MainService.Core.DTOs.MedicalRecord;
using MainService.Core.Helpers.Pagination;
using MainService.Models.Entities;
using MainService.Models.Entities.Aggregate;

namespace MainService.Core.Interfaces.Data;

public interface IDiseaseRepository
{
    Task<Disease?> GetByIdAsync(int id);
    Task<List<OptionDto>> GetOptionsAsync();
    Task<bool> ExistsByIdAsync(int id);
    Task<bool> ExistsByNameAsync(string name);
    Task<bool> ExistsByCodeAsync(string code);
    Task<List<DiseaseDto>> GetAllDtosAsync();
    Task<PagedList<DiseaseDto>> GetPagedListAsync(DiseaseParams param, bool getAll = false);
    Task<DiseaseDto?> GetDtoByIdAsync(int id);
    Task<Disease?> GetAsNoTrackingByIdAsync(int id);
    Task<DiseaseDto?> FindDtoByNameAsync(string name);
    Task<Disease?> GetByNameAsync(string name);
    Task<Disease?> GetByCodeAsync(string code);
    void Add(Disease item);
    void Delete(Disease item);
}

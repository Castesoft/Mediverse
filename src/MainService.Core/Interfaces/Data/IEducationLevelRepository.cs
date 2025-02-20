using MainService.Core.DTOs.MedicalRecord;
using MainService.Core.Helpers.Pagination;
using MainService.Models.Entities;
using MainService.Models.Entities.Aggregate;

namespace MainService.Core.Interfaces.Data;

public interface IEducationLevelRepository
{
    Task<EducationLevel?> GetByIdAsync(int id);
    Task<List<OptionDto>> GetOptionsAsync();
    Task<bool> ExistsByIdAsync(int id);
    Task<bool> ExistsByNameAsync(string name);
    Task<bool> ExistsByCodeAsync(string code);
    Task<List<EducationLevelDto>> GetAllDtosAsync();
    Task<PagedList<EducationLevelDto>> GetPagedListAsync(EducationLevelParams param, bool getAll = false);
    Task<EducationLevelDto?> GetDtoByIdAsync(int id);
    Task<EducationLevel?> GetAsNoTrackingByIdAsync(int id);
    Task<EducationLevelDto?> FindDtoByNameAsync(string name);
    Task<EducationLevel?> GetByNameAsync(string name);
    Task<EducationLevel?> GetByCodeAsync(string code);
    void Add(EducationLevel item);
    void Delete(EducationLevel item);
}

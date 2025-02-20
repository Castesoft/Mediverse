using MainService.Core.DTOs.MedicalRecord;
using MainService.Core.Helpers.Pagination;
using MainService.Models.Entities;
using MainService.Models.Entities.Aggregate;

namespace MainService.Core.Interfaces.Data;

public interface IColorBlindnessRepository
{
    Task<ColorBlindness?> GetByIdAsync(int id);
    Task<List<OptionDto>> GetOptionsAsync();
    Task<bool> ExistsByIdAsync(int id);
    Task<bool> ExistsByNameAsync(string name);
    Task<bool> ExistsByCodeAsync(string code);
    Task<List<ColorBlindnessDto>> GetAllDtosAsync();
    Task<PagedList<ColorBlindnessDto>> GetPagedListAsync(ColorBlindnessParams param, bool getAll = false);
    Task<ColorBlindnessDto?> GetDtoByIdAsync(int id);
    Task<ColorBlindness?> GetAsNoTrackingByIdAsync(int id);
    Task<ColorBlindnessDto?> FindDtoByNameAsync(string name);
    Task<ColorBlindness?> GetByNameAsync(string name);
    Task<ColorBlindness?> GetByCodeAsync(string code);
    void Add(ColorBlindness item);
    void Delete(ColorBlindness item);
}

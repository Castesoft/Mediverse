using MainService.Core.DTOs;
using MainService.Core.Helpers.Pagination;
using MainService.Models.Entities;
using MainService.Models.Entities.Aggregate;

namespace MainService.Core.Interfaces.Data;

public interface IRelativeTypeRepository
{
    Task<RelativeType> GetByIdAsync(int id);
    Task<List<OptionDto>> GetOptionsAsync();
    Task<bool> ExistsByIdAsync(int id);
    Task<bool> ExistsByNameAsync(string name);
    Task<bool> ExistsByCodeAsync(string code);
    Task<List<RelativeTypeDto>> GetAllDtosAsync();
    Task<PagedList<RelativeTypeDto>> GetPagedListAsync(RelativeTypeParams param, bool getAll = false);
    Task<RelativeTypeDto> GetDtoByIdAsync(int id);
    Task<RelativeType> GetAsNoTrackingByIdAsync(int id);
    Task<RelativeTypeDto> FindDtoByNameAsync(string name);
    Task<RelativeType> GetByNameAsync(string name);
    Task<RelativeType> GetByCodeAsync(string code);
    void Add(RelativeType item);
    void Delete(RelativeType item);
}

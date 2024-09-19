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
    Task<bool> NameUniqueAsync(string name);
    Task<bool> CodeUniqueAsync(string code);
    Task<List<RelativeTypeDto>> GetAllAsNoTrackingAsync();
    Task<PagedList<RelativeTypeDto>> GetPagedListAsync(RelativeTypeParams param, bool getAll = false);
    Task<RelativeTypeDto> GetDtoByIdAsync(int id);
    Task<RelativeType> GetAsNoTrackingByIdAsync(int id);
    Task<RelativeTypeDto> FindDtoByNameAsync(string name);
    Task<RelativeType> GetByNameAsync(string name);
    void Add(RelativeType item);
    void Delete(RelativeType item);
}

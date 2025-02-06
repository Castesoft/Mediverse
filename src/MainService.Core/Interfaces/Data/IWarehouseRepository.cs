using System.Security.Claims;
using MainService.Core.DTOs.Warehouses;
using MainService.Core.Helpers.Pagination;
using MainService.Core.Helpers.Params;
using MainService.Models.Entities;
using MainService.Models.Entities.Aggregate;

namespace MainService.Core.Interfaces.Data;
public interface IWarehouseRepository
{
    void Add(Warehouse item);
    void Delete(Warehouse item);
    Task<Warehouse?> GetByIdAsync(int id);
    Task<WarehouseDto?> GetDtoByIdAsync(int id);
    Task<List<OptionDto>> GetOptionsAsync(WarehouseParams param);
    Task<Warehouse?> GetByIdAsNoTrackingAsync(int id);
    Task<List<Warehouse>> GetAllAsync();
    Task<List<WarehouseDto>> GetAllDtoAsync(WarehouseParams param);
    Task<PagedList<WarehouseDto>> GetPagedListAsync(WarehouseParams param, ClaimsPrincipal user);
    Task<bool> ExistsByIdAsync(int id);
}
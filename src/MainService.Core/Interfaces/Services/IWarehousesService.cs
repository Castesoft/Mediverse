using MainService.Models.Entities;

namespace MainService.Core.Interfaces.Services;

public interface IWarehousesService
{
    Task<bool> DeleteAsync(Warehouse item);
}
using MainService.Core.Interfaces.Services;
using MainService.Models.Entities;

namespace MainService.Infrastructure.Services;

public class WarehousesService(IUnitOfWork uow) : IWarehousesService
{
    public async Task<bool> DeleteAsync(Warehouse item)
    {
        // Elimina todas las entidades relacionadas
        // if (!await DeletePhotosAsync(advice)) return false;
        // if (!await DeleteInformationAsync(advice)) return false;

        Warehouse? itemToDelete = await uow.WarehouseRepository.GetByIdAsync(item.Id);

        if (itemToDelete == null) return false;

        uow.WarehouseRepository.Delete(itemToDelete);

        if (!await uow.Complete()) return false;

        return true;
    }
}
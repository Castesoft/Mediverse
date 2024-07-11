using MainService.Core.Interfaces.Services;
using MainService.Models.Entities;

namespace MainService.Infrastructure.Services;
public class ServicesService(IUnitOfWork uow) : IServicesService
{
    public async Task<bool> DeleteAsync(Service item)
    {
        // Elimina todas las entidades relacionadas
        // if (!await DeletePhotosAsync(advice)) return false;
        // if (!await DeleteInformationAsync(advice)) return false;
        
        var itemToDelete = await uow.ServiceRepository.GetByIdAsync(item.Id);

        uow.ServiceRepository.Delete(itemToDelete);

        if (!await uow.Complete()) return false;
        
        return true;
    }
} 
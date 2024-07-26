using MainService.Core.Interfaces.Services;
using MainService.Models.Entities;

namespace MainService.Infrastructure.Services;
public class PrescriptionsService(IUnitOfWork uow) : IPrescriptionsService
{
    public async Task<bool> DeleteAsync(Prescription item)
    {
        // Elimina todas las entidades relacionadas
        // if (!await DeletePhotosAsync(advice)) return false;
        // if (!await DeleteInformationAsync(advice)) return false;
        
        var itemToDelete = await uow.PrescriptionRepository.GetByIdAsync(item.Id);

        uow.PrescriptionRepository.Delete(itemToDelete);

        if (!await uow.Complete()) return false;
        
        return true;
    }
}
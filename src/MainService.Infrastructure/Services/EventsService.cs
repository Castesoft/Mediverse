using MainService.Core.Interfaces.Services;
using MainService.Models.Entities;

namespace MainService.Infrastructure.Services;
public class EventsService(IUnitOfWork uow) : IEventsService
{
    public async Task<bool> DeleteAsync(Event item)
    {
        // Elimina todas las entidades relacionadas
        // if (!await DeletePhotosAsync(advice)) return false;
        // if (!await DeleteInformationAsync(advice)) return false;
        
        var itemToDelete = await uow.EventRepository.GetByIdAsync(item.Id);

        uow.EventRepository.Delete(itemToDelete);

        if (!await uow.Complete()) return false;
        
        return true;
    }
}
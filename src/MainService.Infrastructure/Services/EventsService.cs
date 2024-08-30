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

    public async Task<bool> IsDoctorAvailableAsync(int doctorId, DateTime dateFrom, DateTime dateTo)
    {
        await Task.Delay(0);
        
        // TODO: Implementar la lógica para verificar si el doctor está disponible en el horario seleccionado
        return true;
    }
}
using MainService.Models.Entities;

namespace MainService.Core.Interfaces.Services;
public interface IEventsService
{
    Task<bool> DeleteAsync(Event item);
}
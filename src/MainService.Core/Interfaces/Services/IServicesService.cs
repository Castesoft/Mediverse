using MainService.Models.Entities;

namespace MainService.Core.Interfaces.Services;
public interface IServicesService
{
    Task<bool> DeleteAsync(Service item);
}
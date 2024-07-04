using MainService.Models.Entities;

namespace MainService.Core.Interfaces.Services;
public interface IPhotosService
{
    Task<bool> DeleteAsync(Photo item);
}
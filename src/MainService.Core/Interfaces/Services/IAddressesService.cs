using MainService.Models.Entities;

namespace MainService.Core.Interfaces.Services;
public interface IAddressesService
{
    Task<bool> DeleteAsync(Address item);
}
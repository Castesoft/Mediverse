using MainService.Core.DTOs.Addresses;
using MainService.Models.Entities;

namespace MainService.Core.Interfaces.Services;
public interface IAddressesService
{
    Task<bool> DeleteAsync(Address item);
    Task<List<ZipcodeAddressOption>> GetZipcodeAddressOptionsAsync(string zipcode);
}
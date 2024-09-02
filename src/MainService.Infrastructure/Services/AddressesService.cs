using MainService.Core.DTOs.Addresses;
using MainService.Core.Interfaces.Services;
using MainService.Models.Entities;

namespace MainService.Infrastructure.Services;
public class AddressesService(IUnitOfWork uow) : IAddressesService
{
    public async Task<bool> DeleteAsync(Address item)
    {
        // Elimina todas las entidades relacionadas
        // if (!await DeletePhotosAsync(advice)) return false;
        // if (!await DeleteInformationAsync(advice)) return false;
        
        var itemToDelete = await uow.AddressRepository.GetByIdAsync(item.Id);

        uow.AddressRepository.Delete(itemToDelete);

        if (!await uow.Complete()) return false;
        
        return true;
    }

    public async Task<List<ZipcodeAddressOption>> GetZipcodeAddressOptionsAsync(string zipcode)
    {
        return await uow.AddressRepository.GetZipcodeAddressOptionsAsync(zipcode);
    }
} 
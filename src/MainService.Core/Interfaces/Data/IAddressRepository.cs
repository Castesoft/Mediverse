using System.Security.Claims;
using MainService.Core.DTOs.Addresses;
using MainService.Core.Helpers.Pagination;
using MainService.Core.Helpers.Params;
using MainService.Models.Entities;

namespace MainService.Core.Interfaces.Data;
public interface IAddressRepository
{
void Add(Address item);
    void Delete(Address item);
    Task<Address> GetByIdAsync(int id);
    Task<bool> ClinicExistsAsync(int id, ClaimsPrincipal user);
    Task<AddressDto> GetDtoByIdAsync(int id);
    Task<Address> GetByIdAsNoTrackingAsync(int id);
    Task<List<Address>> GetAllAsync();
    Task<List<AddressDto>> GetAllDtoAsync(AddressParams param);
    Task<PagedList<AddressDto>> GetPagedListAsync(AddressParams param, ClaimsPrincipal user);
}
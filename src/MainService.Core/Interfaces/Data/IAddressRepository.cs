using System.Security.Claims;
using MainService.Core.DTOs.Addresses;
using MainService.Core.Helpers.Pagination;
using MainService.Core.Helpers.Params;
using MainService.Models.Entities;
using MainService.Models.Entities.Aggregate;

namespace MainService.Core.Interfaces.Data;
public interface IAddressRepository
{
void Add(Address item);
    void Delete(Address item);
    Task<Address> GetByIdAsync(int id);
    Task<bool> ExistsByIdAndDoctorIdAsync(int id, int doctorId);
    Task<AddressDto> GetDtoByIdAsync(int id);
    Task<Address> GetByIdAsNoTrackingAsync(int id);
    Task<List<Address>> GetAllAsync();
    Task<List<AddressDto>> GetAllDtoAsync(AddressParams param);
    Task<PagedList<AddressDto>> GetPagedListAsync(AddressParams param, ClaimsPrincipal user);
    Task<List<ZipcodeAddressOption>> GetZipcodeAddressOptionsAsync(string zipcode);
    Task<bool> ExistsByIdAsync(int id);
    Task<bool> DoctorHasAddressAsync(int doctorId, int addressId);
    Task<List<OptionDto>> GetClinicOptionsForDoctorAsync(AddressParams param);
}
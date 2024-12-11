using System.Security.Claims;
using MainService.Core.DTOs.Clinics;
using MainService.Core.Helpers.Pagination;
using MainService.Core.Helpers.Params;
using MainService.Models.Entities.Aggregate;

namespace MainService.Core.Interfaces.Data
{
    public interface IClinicRepository
    {
        Task<List<ClinicDto>> GetAllDtoAsync(ClinicParams param);
        Task<bool> ExistsByIdAndDoctorIdAsync(int id, int doctorId);
        Task<ClinicDto?> GetDtoByIdAsync(int id);
        Task<PagedList<ClinicDto>> GetPagedListAsync(ClinicParams param, ClaimsPrincipal user);
        Task<bool> DoctorHasAddressAsync(int doctorId, int addressId);
        Task<List<OptionDto>> GetClinicOptionsForDoctorAsync(AddressParams param);
    }
}
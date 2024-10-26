using System.Security.Claims;
using MainService.Core.DTOs.Services;
using MainService.Core.Helpers.Pagination;
using MainService.Core.Helpers.Params;
using MainService.Models.Entities;

namespace MainService.Core.Interfaces.Data;
public interface IServiceRepository
{
    void Add(Service item);
    void Delete(Service item);
    Task<Service> GetByIdAsync(int id);
    Task<Service> GetByNameAsync(string name, ClaimsPrincipal user);
    Task<bool> ExistsByIdAndDoctorIdAsync(int id, int doctorId);
    Task<ServiceDto> GetDtoByIdAsync(int id);
    Task<Service> GetByIdAsNoTrackingAsync(int id);
    Task<List<Service>> GetAllAsync();
    Task<List<ServiceDto>> GetAllDtoAsync(ServiceParams param, ClaimsPrincipal user);
    Task<PagedList<ServiceDto>> GetPagedListAsync(ServiceParams param, ClaimsPrincipal user);
    Task<bool> ExistsByIdAsync(int id);
}
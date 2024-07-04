using MainService.Core.DTOs;
using MainService.Core.DTOs.User;
using MainService.Core.Helpers.Pagination;
using MainService.Core.Helpers.Params;
using MainService.Models.Entities;

namespace MainService.Core.Interfaces.Data;
public interface IUserRepository
{
    void Add(AppUser item);
    void Delete(AppUser item);
    Task<AppUser> GetByIdAsync(int id);
    Task<UserDto> GetDtoByIdAsync(int id);
    Task<AppUser> GetByIdAsNoTrackingAsync(int id);
    Task<PrescriptionInformationDto> GetPrescriptionInformationAsync(int doctorId);
    Task<List<AppUser>> GetAllAsync();
    Task<List<UserDto>> GetAllDtoAsync(UserParams param);
    Task<PagedList<UserDto>> GetPagedListAsync(UserParams param);
}
using System.Security.Claims;
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
    Task<List<UserSummaryDto>> GetSummaryDtosAsync(UserParams param, ClaimsPrincipal user);
    Task<bool> PatientExistsAsync(int id, ClaimsPrincipal user);
    Task<bool> NurseExistsAsync(int id, ClaimsPrincipal user);
    Task<UserDto> GetDtoByEmailAsync(string email);
    Task<AppUser> GetByIdAsNoTrackingAsync(int id);
    Task<List<AppUser>> GetAllAsync();
    Task<List<UserDto>> GetAllDtoAsync(UserParams param);
    Task<PagedList<UserDto>> GetPagedListAsync(UserParams param, ClaimsPrincipal user);
    Task<List<PaymentMethodTypeDto>> GetPaymentMethodTypesAsync();
    Task<List<SpecialtyDto>> GetSpecialtiesAsync();
}
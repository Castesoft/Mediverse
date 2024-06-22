using MainService.Core.DTOs;
using MainService.Models.Entities;

namespace MainService.Core.Interfaces.Services;
public interface IUsersService
{
    Task<bool> DeleteUserAsync(AppUser user);
    Task<AccountDto> GenerateAccountDtoAsync(int userId);
}
using MainService.Models.Entities;

namespace MainService.Core.Interfaces.Services;
public interface ITokenService
{
    Task<string> CreateToken(AppUser user);
}
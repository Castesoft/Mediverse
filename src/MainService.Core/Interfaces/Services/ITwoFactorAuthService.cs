using MainService.Models.Entities;

namespace MainService.Core.Interfaces.Services
{
    public interface ITwoFactorAuthService
    {
        Task<(string, string)> GenerateTwoFactorTokenAsync(AppUser user);
    }
}
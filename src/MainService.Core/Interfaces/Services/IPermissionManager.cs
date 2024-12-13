using MainService.Models.Entities;
using Microsoft.AspNetCore.Identity;

namespace MainService.Core.Interfaces.Services;
public interface IPermissionManager
{
    Task<bool> CreateAsync(AppPermission permission);
    Task<IdentityResult> AddToPermissionsAsync(AppUser user, string[] permissions);
    Task<IdentityResult> AddToPermissionAsync(AppUser user, string permission);
    Task<string?> GetPermissionDescriptionByName(string name);
    Task<IdentityResult> AddToAllPermissionsAsync(AppUser user);
    Task<bool> AnyAsync();
}
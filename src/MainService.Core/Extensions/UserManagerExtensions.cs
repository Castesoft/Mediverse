using MainService.Models.Entities;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace MainService.Core.Extensions;
public static class UserManagerExtensions
{
    public static async Task<IEnumerable<string>> GetPermissionsAsync(this UserManager<AppUser> userManager, AppUser user)
    {
        var appUser = await userManager.Users
            .Include(x => x.UserPermissions)
                .ThenInclude(x => x.Permission)
            .SingleOrDefaultAsync(x => x.Id == user.Id);

        var permissions = appUser.UserPermissions.Select(x => x.Permission.Name).ToList();

        return permissions;
    }
}
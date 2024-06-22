using MainService.Core.Interfaces.Services;
using MainService.Models;
using MainService.Models.Entities;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace MainService.Infrastructure.Data;
public class PermissionManager : IPermissionManager
{
    private readonly DataContext _context;
    public PermissionManager(DataContext context)
    {
        _context = context;
    }

    public async Task<bool> CreateAsync(AppPermission permission)
    {
        _context.Permissions.Add(permission);
        return await _context.SaveChangesAsync() > 0;
    }

    public async Task<IdentityResult> AddToPermissionsAsync(AppUser user, string[] permissions)
    {
        foreach (var permission in permissions)
        {
            var result = await AddToPermissionAsync(user, permission);

            // if (!result.Succeeded)
            // {

            // }
            Console.WriteLine(result.Succeeded ? "Permission added successfully" : "Error adding permission");
        }

        return IdentityResult.Success;
    }

    public async Task<IdentityResult> AddToPermissionAsync(AppUser user, string permission)
    {
        // Check if user exists
        if (!await PermissionExists(permission))
        {
            return IdentityResult.Failed(new IdentityError { Description = $"Permission {permission} does not exist" });
        }

        // Check if user already has permission
        if (await UserHasPermission(user, permission))
        {
            Console.WriteLine("User already has permission: " + permission);
            // return IdentityResult.Failed(new IdentityError { Description = $"User already has permission {permission}" });
        }
        else
        {
            // Add permission to user
            AppUserPermission userPermission = new()
            {
                UserId = user.Id,
                PermissionId = await _context.Permissions
                    .AsNoTracking()
                    .Where(x => x.Name == permission)
                    .Select(x => x.Id)
                    .FirstOrDefaultAsync()
            };

            _context.UserPermissions.Add(userPermission);

            if (await _context.SaveChangesAsync() <= 0)
            {
                return IdentityResult.Failed(new IdentityError { Description = $"Failed to add permission {permission} to user" });
            }
        }

        return IdentityResult.Success;
    }

    private async Task<bool> PermissionExists(string permission)
    {
        return await _context.Permissions
            .AsNoTracking()
            .AnyAsync(x => x.Name == permission);
    }

    private async Task<bool> UserHasPermission(AppUser user, string permission)
    {
        return await _context.UserPermissions
            .AsNoTracking()
            .Include(x => x.Permission)
            .AnyAsync(x => x.UserId == user.Id && x.Permission.Name == permission);
    }

    public async Task<string> GetPermissionDescriptionByName(string name)
    {
        return await _context.Permissions
            .AsNoTracking()
            .Where(x => x.Name == name)
            .Select(x => x.Description)
            .FirstOrDefaultAsync();
    }

    public async Task<IdentityResult> AddToAllPermissionsAsync(AppUser user)
    {
        var permissions = _context.Permissions
            .AsNoTracking()
            .Select(x => x.Name)
            .ToArray();

        return await AddToPermissionsAsync(user, permissions);
    }

    public async Task<bool> AnyAsync()
    {
        return await _context.Permissions.AnyAsync();
    }
}
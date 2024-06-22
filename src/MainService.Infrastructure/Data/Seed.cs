using MainService.Core.Interfaces.Services;
using MainService.Models;
using MainService.Models.Entities;
using MainService.Models.Helpers;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Serilog;

namespace MainService.Infrastructure.Data;

public class Seed
{
    public static async Task SeedRolesAndPermissionsAsync(RoleManager<AppRole> roleManager, IPermissionManager permissionManager)
    {
        if (await roleManager.Roles.AnyAsync()) return;

        var seedingRoles = SeedData.getRolesWithPermissions();

        int idx = 1;

        foreach (var role in seedingRoles)
        {
            Log.Information($"({idx++}/{seedingRoles.Count()}) creating role: {role.Name}.");
            await roleManager.CreateAsync(new(role.Name));
        }

        Log.Information($"{seedingRoles.Count()} roles created.");

        idx = 1;

        IEnumerable<AppPermission> seedingPermissions = seedingRoles.SelectMany(x => x.RolePermissions.Select(y => y.Permission)).Distinct();

        foreach (var permission in seedingPermissions)
        {
            Log.Information($"({idx++}/{seedingPermissions.Count()}) creating permission: {permission.Name}.");
            await permissionManager.CreateAsync(permission);
        }

        Log.Information($"{seedingPermissions.Count()} distinct permissions created.");

        idx = 1;

        // TODO
    }

    public static async Task SeedUsersAsync(UserManager<AppUser> userManager)
    {
        if (await userManager.Users.AnyAsync()) return;
    }
    
    public static async Task SeedServicesAsync(DataContext context, bool oneByOne = false)
    {
        if (await context.Services.AnyAsync()) return;

        var seedingServices = SeedData.services;

        int idx = 1; int size = seedingServices.Count();
        if (oneByOne)
        {
            foreach (var item in seedingServices)
            {
                context.Services.Add(item);
                context.SaveChanges();
                Log.Information($"({idx++}/{size}) creating service: {item.Name}.");
            }
        } else {
            context.Services.AddRange(seedingServices);
            context.SaveChanges();
        }

        Log.Information($"{size} services created.");
    }

    public static async Task SeedProductsAsync(DataContext context, bool oneByOne = false)
    {
        if (await context.Products.AnyAsync()) return;

        var seedingProducts = SeedData.products;

        int idx = 1; int size = seedingProducts.Count();
        if (oneByOne)
        {
            foreach (var item in seedingProducts)
            {
                context.Products.Add(item);
                context.SaveChanges();
                Log.Information($"({idx++}/{size}) creating product: {item.Name}.");
            }
        } else {
            context.Products.AddRange(seedingProducts);
            context.SaveChanges();
        }

        Log.Information($"{size} products created.");
    }
}

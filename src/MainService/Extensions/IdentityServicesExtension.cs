using System.Text;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.IdentityModel.Tokens;
using Microsoft.AspNetCore.Authorization;
using MainService.Models.Entities;
using MainService.Authorization.Handlers;
using MainService.Models;
using MainService.Models.Helpers;

namespace MainService.Extensions;
public static class IdentityServiceExtensions
{
    public static IServiceCollection AddIdentityServices(this IServiceCollection services, IConfiguration config)
    {
        services.AddIdentityCore<AppUser>(opt =>
        {
            opt.Password.RequireDigit = false;
            opt.Password.RequiredLength = 6;
            opt.Password.RequireNonAlphanumeric = false;
            opt.Password.RequireUppercase = false;
            opt.Password.RequireLowercase = false;
        })
            // Sign In
            .AddSignInManager<SignInManager<AppUser>>()

            // Roles
            .AddRoles<AppRole>()
            .AddRoleManager<RoleManager<AppRole>>()
            .AddRoleValidator<RoleValidator<AppRole>>()

            // Entity Framework Stores
            .AddEntityFrameworkStores<DataContext>()
            
            .AddDefaultTokenProviders();

        services.Configure<DataProtectionTokenProviderOptions>(opt =>
            opt.TokenLifespan = TimeSpan.FromHours(2));

        services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme).AddJwtBearer(options =>
        {
            options.TokenValidationParameters = new()
            {
                ValidateIssuerSigningKey = true,
                IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(config["TokenSettings:Key"])),
                ValidateIssuer = false,
                ValidateAudience = false,
                ValidateLifetime = true,
                ClockSkew = TimeSpan.Zero
            };
        });

        services.AddScoped<IAuthorizationHandler, PermissionAuthorizationHandler>();

        services.AddAuthorization(options =>
        {
            foreach (var role in SeedData.getRolesWithPermissions()) {
                options.AddPolicy(role.Name, policy => {
                    policy.RequireRole(role.Name);
                    foreach (var permission in role.RolePermissions)
                        policy.Requirements.Add(new PermissionRequirement(permission.Permission.Name));
                });
            }
        });

        return services;
    }

}
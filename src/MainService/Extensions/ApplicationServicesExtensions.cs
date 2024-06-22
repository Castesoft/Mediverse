using MainService.Errors;
using MainService.Core.Interfaces.Services;
using Microsoft.AspNetCore.Mvc;
using Serilog;
using MainService.Infrastructure.Data;
using MainService.Core.Settings;
using MainService.Infrastructure.Services;

namespace MainService.Extensions;
public static class ApplicationServicesExtensions
{
    public static IServiceCollection AddApplicationServices(this IServiceCollection services,
        IConfiguration config)
    {

        // Settings
        services.Configure<TokenSettings>(config.GetSection("TokenSettings"));
        services.Configure<EmailSettings>(config.GetSection("EmailSettings"));
        services.Configure<TwilioSettings>(config.GetSection("TwilioSettings"));
        services.Configure<CloudinarySettings>(config.GetSection("CloudinarySettings"));

        services.AddAutoMapper(AppDomain.CurrentDomain.GetAssemblies());

        // Services
        services.AddScoped<ITokenService, TokenService>();
        services.AddScoped<IUsersService, UsersService>();
        services.AddScoped<IEmailService, EmailService>();
        services.AddScoped<ITwilioService, TwilioService>();
        services.AddScoped<ICloudinaryService, CloudinaryService>();
        services.AddScoped<IPermissionManager, PermissionManager>();
        services.AddScoped<IUnitOfWork, UnitOfWork>();
        services.AddSingleton(Log.Logger);

        // Error handling
        services.Configure<ApiBehaviorOptions>(options =>
        {
            options.InvalidModelStateResponseFactory = actionContext =>
            {
                var errors = actionContext.ModelState
                    .Where(e => e.Value.Errors.Count > 0)
                    .SelectMany(x => x.Value.Errors)
                    .Select(x => x.ErrorMessage).ToArray();

                ApiValidationErrorResponse errorResponse = new(errors);

                return new BadRequestObjectResult(errorResponse);
            };
        });

        services.AddCors(opt =>
        {
            opt.AddPolicy("CorsPolicy", policy =>
            {
                policy
                    .AllowAnyHeader()
                    .AllowAnyMethod()
                    .AllowCredentials()
                    .WithOrigins(["https://localhost:4400", "https://beta.mediverse.castesoft.com"]);
            });
        });

        return services;
    }
}
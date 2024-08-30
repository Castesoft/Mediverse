using MainService.Core.Interfaces.Services;
using Serilog;
using MainService.Infrastructure.Data;
using MainService.Core.Settings;
using MainService.Infrastructure.Services;
using MainService.Core.Interfaces.Data;

namespace MainService.Extensions;
public static class ApplicationServicesExtensions
{
    public static IServiceCollection AddApplicationServices(this IServiceCollection services,
        IConfiguration config)
    {
        services.AddHttpClient();

        // Settings
        services.Configure<TokenSettings>(config.GetSection("TokenSettings"));
        services.Configure<EmailSettings>(config.GetSection("EmailSettings"));
        services.Configure<TwilioSettings>(config.GetSection("TwilioSettings"));
        services.Configure<CloudinarySettings>(config.GetSection("CloudinarySettings"));
        services.Configure<GoogleSettings>(config.GetSection("GoogleSettings"));
        services.Configure<ClientSettings>(config.GetSection("ClientSettings"));

        services.AddAutoMapper(AppDomain.CurrentDomain.GetAssemblies());

        services.AddHostedService<CronJobsService>();

        // Services
        services.AddScoped<ITokenService, TokenService>();
        services.AddScoped<IUsersService, UsersService>();
        services.AddScoped<IAddressesService, AddressesService>();
        services.AddScoped<IServicesService, ServicesService>();
        services.AddScoped<IEmailService, EmailService>();
        services.AddScoped<ITwilioService, TwilioService>();
        services.AddScoped<ICloudinaryService, CloudinaryService>();
        services.AddScoped<IGoogleService, GoogleService>();
        services.AddScoped<IQRCoderService, QRCoderService>();
        services.AddScoped<ITwoFactorAuthService, TwoFactorAuthService>();
        services.AddScoped<IPermissionManager, PermissionManager>();
        services.AddScoped<IProductsService, ProductsService>();
        services.AddScoped<IPrescriptionsService, PrescriptionsService>();
        services.AddScoped<IPhotosService, PhotosService>();
        services.AddScoped<IStripeService, StripeService>();
        services.AddScoped<IUnitOfWork, UnitOfWork>();
        services.AddScoped<ICodeService, CodeService>();
        services.AddScoped<IPhoneService, PhoneService>();
        services.AddScoped<IEventsService, EventsService>();
        services.AddSingleton(Log.Logger);

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
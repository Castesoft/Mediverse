using MainService.Authorization.Handlers;
using MainService.Core.Interfaces.Services;
using Serilog;
using MainService.Infrastructure.Data;
using MainService.Core.Settings;
using MainService.Helpers;
using MainService.Infrastructure.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;

namespace MainService.Extensions;

public static class ApplicationServicesExtensions
{
    public static void AddApplicationServices(this IServiceCollection services, IConfiguration config)
    {
        services.AddHttpClient();

        // Settings
        services.Configure<TokenSettings>(config.GetSection("TokenSettings"));
        services.Configure<EmailSettings>(config.GetSection("EmailSettings"));
        services.Configure<TwilioSettings>(config.GetSection("TwilioSettings"));
        services.Configure<CloudinarySettings>(config.GetSection("CloudinarySettings"));
        services.Configure<GoogleSettings>(config.GetSection("GoogleSettings"));
        services.Configure<ClientSettings>(config.GetSection("ClientSettings"));
        services.Configure<StripeSettings>(config.GetSection("StripeSettings"));
        
        services.AddAutoMapper(AppDomain.CurrentDomain.GetAssemblies());

        // TODO: Add hosted services
        // services.AddHostedService<CronJobsService>();

        // Services
        services.AddSingleton<IUserIdProvider, CustomUserIdProvider>();
        services.AddScoped<ITokenService, TokenService>();
        
        services.AddScoped<IMedicalInsuranceCompaniesService, MedicalInsuranceCompaniesService>();
        services.AddScoped<IMedicalRecordsService, MedicalRecordsService>();
        services.AddScoped<IOrdersService, OrdersService>();
        services.AddScoped<ISpecialtiesService, SpecialtiesService>();
        services.AddScoped<IPaymentMethodTypesService, PaymentMethodTypesService>();
        services.AddScoped<IDiseasesService, DiseasesService>();
        services.AddScoped<ISubstancesService, SubstancesService>();
        services.AddScoped<IOccupationsService, OccupationsService>();
        services.AddScoped<IMaritalStatusesService, MaritalStatusesService>();
        services.AddScoped<IEducationLevelsService, EducationLevelsService>();
        services.AddScoped<IColorBlindnessesService, ColorBlindnessesService>();
        services.AddScoped<IDeliveryStatusesService, DeliveryStatusesService>();
        services.AddScoped<IOrderStatusesService, OrderStatusesService>();
        services.AddScoped<IRelativeTypesService, RelativeTypesService>();
        services.AddScoped<IConsumptionLevelsService, ConsumptionLevelsService>();

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
        services.AddScoped<IWarehousesService, WarehousesService>();
        services.AddScoped<IPaymentService, PaymentService>();
        services.AddScoped<INotificationsService, NotificationsService>();
        services.AddScoped<IAccountsService, AccountsService>();
        services.AddScoped<IDoctorNursesService, DoctorNursesService>();
        
        services.AddScoped<IAuthorizationHandler, PermissionAuthorizationHandler>();
        services.AddScoped<IAuthorizationHandler, PrescriptionAuthorizationHandler>();
        services.AddScoped<IAuthorizationHandler, EventAuthorizationHandler>();
        services.AddScoped<IAuthorizationHandler, ClinicAuthorizationHandler>();
        services.AddScoped<IAuthorizationHandler, OrderAuthorizationHandler>();
        services.AddScoped<IAuthorizationHandler, ProductAuthorizationHandler>();
        services.AddScoped<IAuthorizationHandler, ServiceAuthorizationHandler>();
        services.AddScoped<IAuthorizationHandler, NotificationAuthorizationHandler>();
        services.AddScoped<IAuthorizationHandler, PatientAuthorizationHandler>();
        services.AddScoped<IAuthorizationHandler, NurseAuthorizationHandler>();
        services.AddScoped<IAuthorizationHandler, UserAddressAuthorizationHandler>();
        services.AddScoped<IAuthorizationHandler, UserPaymentMethodAuthorizationHandler>();
        services.AddScoped<IAuthorizationHandler, SubscriptionAuthorizationHandler>();
        services.AddScoped<IAuthorizationHandler, WarehouseAuthorizationHandler>();

        services.AddSignalR();
        
        services.AddSingleton(Log.Logger);

        services.AddCors(opt =>
        {
            opt.AddPolicy("CorsPolicy", policy =>
            {
                policy
                    .AllowAnyHeader()
                    .AllowAnyMethod()
                    .AllowCredentials()
                    .WithOrigins("https://localhost:4400", "https://dochub.mx");
            });
        });
    }
}
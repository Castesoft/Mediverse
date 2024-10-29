using MainService.Core.Interfaces.Services;
using MainService.Extensions;
using MainService.Infrastructure.Data;
using MainService.Middleware;
using MainService.Models;
using MainService.Models.Entities;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Serilog;
using static MainService.Provider;

Log.Logger = new LoggerConfiguration()
    .WriteTo.Console()
    .CreateBootstrapLogger();

Log.Information("Starting up");

var builder = WebApplication.CreateBuilder(args);

builder.Host.UseSerilog((ctx, lc) => lc
    .WriteTo.Console(
        outputTemplate:
        "[{Timestamp:HH:mm:ss} {Level}] {SourceContext}{NewLine}{Message:lj}{NewLine}{Exception}{NewLine}")
    .Enrich.FromLogContext()
    .ReadFrom.Configuration(ctx.Configuration));

var config = builder.Configuration;

    builder.Services.AddDbContext<DataContext>(options =>
    {
        var provider = config.GetValue("provider", Sqlite.Name);

        if (
            builder.Environment.IsDevelopment()
            // false
            )
        {
            if (provider == Sqlite.Name)
            {
                options.UseSqlite(
                    config.GetConnectionString(Sqlite.Name)!, x => {
                    x.MigrationsAssembly(Sqlite.Assembly);
                    x.UseQuerySplittingBehavior(QuerySplittingBehavior.SplitQuery);
                });
            }

            if (provider == Postgres.Name)
            {
                options.UseNpgsql(config.GetConnectionString(Postgres.Name)!, x => {
                    x.MigrationsAssembly(Postgres.Assembly);
                    x.UseQuerySplittingBehavior(QuerySplittingBehavior.SplitQuery);
                });
            }
        }
        else
        {
            options.UseNpgsql(config.GetConnectionString(Postgres.Name)!, x => {
                x.MigrationsAssembly(Postgres.Assembly);
                x.UseQuerySplittingBehavior(QuerySplittingBehavior.SplitQuery);
            });
        }
    });

builder.Services.AddControllers();
builder.Services.AddApplicationServices(builder.Configuration);
builder.Services.AddIdentityServices(builder.Configuration);

var app = builder.Build();

app.UseMiddleware<ExceptionMiddleware>();

app.UseCors("CorsPolicy");

app.UseAuthentication();
app.UseAuthorization();

app.UseDefaultFiles();
app.UseStaticFiles();

app.MapControllers();
app.MapFallbackToController("Index", "Fallback");

using var scope = app.Services.CreateScope();
var services = scope.ServiceProvider;
var context = services.GetRequiredService<DataContext>(); 
var permissionManager = services.GetRequiredService<IPermissionManager>(); 
var userManager = services.GetRequiredService<UserManager<AppUser>>();
var roleManager = services.GetRequiredService<RoleManager<AppRole>>();
try
{
    await context.Database.MigrateAsync();
    Log.Information("Database migration applied.");
    
    await Seed.SeedRolesAndPermissionsAsync(roleManager, permissionManager);
    await Seed.SeedAsync(userManager, context, 30, 100);
    // await Seed.SeedProductsAsync(context);
    
    Log.Information("Done seeding database. Exiting.");
}
catch (Exception ex)
{
    Log.Error(ex, "An error occurred during migration.");
}

app.Run();
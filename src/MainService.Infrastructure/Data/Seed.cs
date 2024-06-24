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
    public static async Task SeedRolesAndPermissionsAsync(RoleManager<AppRole> roleManager,
        IPermissionManager permissionManager)
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

        IEnumerable<AppPermission> seedingPermissions =
            seedingRoles.SelectMany(x => x.RolePermissions.Select(y => y.Permission)).Distinct();

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

        var doctor = new AppUser
        {
            UserName = "redacted+005@example.invalid",
            Email = "redacted+005@example.invalid",
            PhoneNumber = "8112089393",
            FirstName = "Ricardo",
            LastName = "Obregón",
            Sex = "Masculino",
            DateOfBirth = new DateOnly(1995, 10, 10),
            PhoneNumberCountryCode = "+52",
            UserPhoto = new UserPhoto()
            {
                Photo = new Photo
                {
                    Url =
                        "https://hips.hearstapps.com/hmg-prod/images/portrait-of-a-happy-young-doctor-in-his-clinic-royalty-free-image-1661432441.jpg?crop=0.66698xw:1xh;center,top&resize=1200:*",
                    Name = "Foto chida",
                    Size = 2,
                }
            },
            DoctorSignature = new DoctorSignature
            {
                Signature = new()
                {
                    Url = "https://cdn.shopify.com/s/files/1/0594/4639/5086/files/Slanted_Signature.jpg",
                    Name = "Firma chida",
                    Size = 2,
                }
            },
            DoctorInformation = new DoctorInformation
            {
                Information = new()
                {
                    MedicalProfessionalLicenses =
                    [
                        new()
                        {
                            MedicalLicense = new()
                            {
                                LicenseNumber = "4468301 (UANL)",
                                SpecialtyLicense = "609706 (UANL)",
                            }
                        },
                        new()
                        {
                            MedicalLicense = new()
                            {
                                LicenseNumber = "1928941 (UANL)",
                                SpecialtyLicense = "923401 (UANL)",
                            }
                        }
                    ],
                }
            },
            DoctorPhones =
            [
                new()
                {
                    Phone = new()
                    {
                        PhoneNumber = "8112089292",
                        Extension = "5454",
                    }
                }
            ],
            DoctorLinks =
            [
                new()
                {
                    Link = new()
                    {
                        Url = "https://www.facebook.com/raul.m.benavides.3/?locale=es_LA",
                        SiteName = "Facebook",
                    }
                },
                new()
                {
                    Link = new()
                    {
                        Url = "https://www.instagram.com/drbenavidesg/?hl=en",
                        SiteName = "Instagram",
                    }
                },
                new()
                {
                    Link = new()
                    {
                        Url = "https://mx.linkedin.com/in/dr-raul-mario-benavides-garza-31014139",
                        SiteName = "LinkedIn",
                    }
                }
            ],
            DoctorClinics =
            [
                new()
                {
                    Clinic = new()
                    {
                        ExteriorNumber = "112",
                        Street = "Batallón de San Patricio",
                        ZipCode = "66278",
                        City = "San Pedro Garza García",
                        State = "Nuevo León",
                        Country = "México",
                        Neighborhood = "Col. Real San Agustín",
                        LocationPhones =
                        [
                            new()
                            {
                                Phone = new()
                                {
                                    PhoneNumber = "8139220332",
                                    Extension = "222",
                                }
                            },
                            new()
                            {
                                Phone = new()
                                {
                                    PhoneNumber = "8132423132",
                                    Extension = "191",
                                }
                            }
                        ]
                    }
                }
            ],
            NurseClinic = null
        };

        var patient = new AppUser
        {
            UserName = "redacted+021@example.invalid",
            Email = "redacted+021@example.invalid",
            PhoneNumber = "8120800336",
            FirstName = "Ramiro",
            LastName = "Castellanos",
            Sex = "Masculino",
            DateOfBirth = new DateOnly(1995, 10, 10),
            UserPhoto = new UserPhoto
            {
                Photo = new()
                {
                    Url =
                        "https://res.cloudinary.com/dmjdskgd4/image/upload/v1711576883/Castesoft/logo_ytz4ej.png",
                    PublicId = "avatars/ramiro_castellanos_barron",
                    Size = 24471, Name = "Foto_ramiro.png"
                }
            },
        };

        await userManager.CreateAsync(doctor, "Pa$$w0rd");
        await userManager.CreateAsync(patient, "Pa$$w0rd");
        
        await userManager.AddToRoleAsync(doctor, "Doctor");
        await userManager.AddToRoleAsync(patient, "Patient");
    }

    public static async Task SeedServicesAsync(DataContext context, bool oneByOne = false)
    {
        if (await context.Services.AnyAsync()) return;

        var seedingServices = SeedData.services;

        int idx = 1;
        int size = seedingServices.Count();
        if (oneByOne)
        {
            foreach (var item in seedingServices)
            {
                context.Services.Add(item);
                context.SaveChanges();
                Log.Information($"({idx++}/{size}) creating service: {item.Name}.");
            }
        }
        else
        {
            context.Services.AddRange(seedingServices);
            context.SaveChanges();
        }

        Log.Information($"{size} services created.");
    }

    public static async Task SeedProductsAsync(DataContext context, bool oneByOne = false)
    {
        if (await context.Products.AnyAsync()) return;

        var seedingProducts = SeedData.products;

        int idx = 1;
        int size = seedingProducts.Count();
        if (oneByOne)
        {
            foreach (var item in seedingProducts)
            {
                context.Products.Add(item);
                context.SaveChanges();
                Log.Information($"({idx++}/{size}) creating product: {item.Name}.");
            }
        }
        else
        {
            context.Products.AddRange(seedingProducts);
            context.SaveChanges();
        }

        Log.Information($"{size} products created.");
    }
}
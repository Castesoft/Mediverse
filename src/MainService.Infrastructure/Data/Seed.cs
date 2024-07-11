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

    public static async Task SeedUsersAsync(UserManager<AppUser> userManager, DataContext context)
    {
        if (await userManager.Users.AnyAsync()) return;

        var doctor1 = new AppUser
        {
            UserName = "rcastellanos@castesoft.com",
            Email = "rcastellanos@castesoft.com",
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
                        PhotoUrl = "https://hcservicios.com.mx/wp-content/uploads/2022/02/Logo_HZH-01.jpg",
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

        var patient1 = new AppUser
        {
            UserName = "ramiro@castellanosbarron.com",
            Email = "ramiro@castellanosbarron.com",
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

        await userManager.CreateAsync(doctor1, "Pa$$w0rd");
        await userManager.CreateAsync(patient1, "Pa$$w0rd");
        
        await userManager.AddToRoleAsync(doctor1, "Doctor");
        await userManager.AddToRoleAsync(patient1, "Patient");

        List<AppUser> patientsForSeeding = SeedData.GenerateUsersForSeeding(100);
        int userIndex = 1;

        var roles = await context.Roles.ToListAsync();
        
        foreach (var user in patientsForSeeding)
        {
            List<string> roleNames = roles.Select(x => x.Name).Where(x => x == "Patient").ToList();
            var createUserResult = await userManager.CreateAsync(user, "Pa$$w0rd");
            if (!createUserResult.Succeeded) return;
            foreach (var roleName in roleNames)
            {
                var roleResult = await userManager.AddToRoleAsync(user, roleName);
                if (!roleResult.Succeeded) return;
            }
            Log.Information($"Seeding patient {$"{userIndex++}/{patientsForSeeding.Count()}", -15} ==> {user.Email}");
        }

        var patients = await userManager.Users
            .Include(x => x.UserRoles).ThenInclude(x => x.Role)
            .Where(x => x.UserRoles.Any(y => y.Role.Name == "Patient"))
            .ToListAsync();

        List<AppUser> doctorsForSeeding = SeedData.GenerateUsersForSeeding(30);
        userIndex = 1;

        foreach (var user in doctorsForSeeding)
        {
            List<string> roleNames = roles.Select(x => x.Name).Where(x => x == "Doctor").ToList();
            var createUserResult = await userManager.CreateAsync(user, "Pa$$w0rd");
            if (!createUserResult.Succeeded) return;
            foreach (var roleName in roleNames)
            {
                var roleResult = await userManager.AddToRoleAsync(user, roleName);
                if (!roleResult.Succeeded) return;
            }
            Log.Information($"Seeding doctor {$"{userIndex++}/{doctorsForSeeding.Count()}", -15} ==> {user.Email}");
        }

        var doctors = await userManager.Users
            .Include(x => x.UserRoles).ThenInclude(x => x.Role)
            .Where(x => x.UserRoles.Any(y => y.Role.Name == "Doctor"))
            .ToListAsync();

        var random = new Random();
        var doctorPatientRelationships = new List<DoctorPatient>();

        foreach (var doctor in doctors)
        {
            int numberOfPatients = random.Next(1, 20);
            var assignedPatients = patients.OrderBy(x => random.Next()).Take(numberOfPatients).ToList();

            foreach (var patient in assignedPatients)
            {
                if (!doctorPatientRelationships.Any(dp => dp.DoctorId == doctor.Id && dp.PatientId == patient.Id))
                {
                    doctorPatientRelationships.Add(new DoctorPatient
                    {
                        DoctorId = doctor.Id,
                        PatientId = patient.Id
                    });
                }
            }
        }

        context.DoctorPatients.AddRange(doctorPatientRelationships);
        await context.SaveChangesAsync();

        if (await context.Services.AnyAsync()) return;
        var seedingServices = SeedData.services;

        foreach (var doctor in doctors)
            foreach (var service in seedingServices)
                context.DoctorServices.Add(new(doctor.Id, service));

        await context.SaveChangesAsync();
        return;
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
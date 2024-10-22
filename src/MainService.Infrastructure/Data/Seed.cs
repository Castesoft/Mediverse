using MainService.Core.Interfaces.Services;
using MainService.Models;
using MainService.Models.Entities;
using MainService.Models.Helpers;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Serilog;

namespace MainService.Infrastructure.Data;

public static class Seed
{
    private static readonly Random Random = new();

    private static async Task SeedMexicoStates(DataContext context)
    {
        if (await context.States.AnyAsync()) return;
        await context.States.AddRangeAsync(SeedDataAguascalientes.state.ToArray());
        Log.Information("Seeding Aguascalientes state.");
        await context.States.AddRangeAsync(SeedDataBajaCalifornia.state.ToArray());
        Log.Information("Seeding Baja California state.");
        await context.States.AddRangeAsync(SeedDataBajaCaliforniaSur.state.ToArray());
        Log.Information("Seeding Baja California Sur state.");
        await context.States.AddRangeAsync(SeedDataCampeche.state.ToArray());
        Log.Information("Seeding Campeche state.");
        await context.States.AddRangeAsync(SeedDataChiapas.state.ToArray());
        Log.Information("Seeding Chiapas state.");
        await context.States.AddRangeAsync(SeedDataChihuahua.state.ToArray());
        Log.Information("Seeding Chihuahua state.");
        await context.States.AddRangeAsync(SeedDataCiudaddeMexico.state.ToArray());
        Log.Information("Seeding Ciudad de México state.");
        await context.States.AddRangeAsync(SeedDataCoahuila.state.ToArray());
        Log.Information("Seeding Coahuila state.");
        await context.States.AddRangeAsync(SeedDataColima.state.ToArray());
        Log.Information("Seeding Colima state.");
        await context.States.AddRangeAsync(SeedDataDurango.state.ToArray());
        Log.Information("Seeding Durango state.");
        await context.States.AddRangeAsync(SeedDataGuanajuato.state.ToArray());
        Log.Information("Seeding Guanajuato state.");
        await context.States.AddRangeAsync(SeedDataGuerrero.state.ToArray());
        Log.Information("Seeding Guerrero state.");
        await context.States.AddRangeAsync(SeedDataHidalgo.state.ToArray());
        Log.Information("Seeding Hidalgo state.");
        await context.States.AddRangeAsync(SeedDataJalisco.state.ToArray());
        Log.Information("Seeding Jalisco state.");
        await context.States.AddRangeAsync(SeedDataMexico.state.ToArray());
        Log.Information("Seeding México state.");
        await context.States.AddRangeAsync(SeedDataMichoacan.state.ToArray());
        Log.Information("Seeding Michoacán state.");
        await context.States.AddRangeAsync(SeedDataMorelos.state.ToArray());
        Log.Information("Seeding Morelos state.");
        await context.States.AddRangeAsync(SeedDataNayarit.state.ToArray());
        Log.Information("Seeding Nayarit state.");
        await context.States.AddRangeAsync(SeedDataNuevoLeon.state.ToArray());
        Log.Information("Seeding Nuevo León state.");
        await context.States.AddRangeAsync(SeedDataOaxaca.state.ToArray());
        Log.Information("Seeding Oaxaca state.");
        await context.States.AddRangeAsync(SeedDataPuebla.state.ToArray());
        Log.Information("Seeding Puebla state.");
        await context.States.AddRangeAsync(SeedDataQueretaro.state.ToArray());
        Log.Information("Seeding Querétaro state.");
        await context.States.AddRangeAsync(SeedDataQuintanaRoo.state.ToArray());
        Log.Information("Seeding Quintana Roo state.");
        await context.States.AddRangeAsync(SeedDataSanLuisPotosi.state.ToArray());
        Log.Information("Seeding San Luis Potosí state.");
        await context.States.AddRangeAsync(SeedDataSinaloa.state.ToArray());
        Log.Information("Seeding Sinaloa state.");
        await context.States.AddRangeAsync(SeedDataSonora.state.ToArray());
        Log.Information("Seeding Sonora state.");
        await context.States.AddRangeAsync(SeedDataTabasco.state.ToArray());
        Log.Information("Seeding Tabasco state.");
        await context.States.AddRangeAsync(SeedDataTamaulipas.state.ToArray());
        Log.Information("Seeding Tamaulipas state.");
        await context.States.AddRangeAsync(SeedDataTlaxcala.state.ToArray());
        Log.Information("Seeding Tlaxcala state.");
        await context.States.AddRangeAsync(SeedDataVeracruz.state.ToArray());
        Log.Information("Seeding Veracruz state.");
        await context.States.AddRangeAsync(SeedDataYucatan.state.ToArray());
        Log.Information("Seeding Yucatán state.");
        await context.States.AddRangeAsync(SeedDataZacatecas.state.ToArray());
        Log.Information("Seeding Zacatecas state.");
        await context.SaveChangesAsync();
    }

    private static async Task<List<Specialty>> SeedSpecialtiesAsync(DataContext context)
    {
        if (!await context.Specialties.AnyAsync()) {

            List<Specialty> specialties = SeedDataSpecialties.specialties.ToList();

            foreach (var specialty in specialties)
            {
                specialty.Code = specialty.Name;
            }
            
            await context.Specialties.AddRangeAsync(specialties);
            await context.SaveChangesAsync();

            return await context.Specialties
                .AsNoTracking()
                .ToListAsync();
        }

        return [];
    }

    private static async Task<List<PaymentMethodType>> SeedPaymentMethodTypesAsync(DataContext context)
    {
        if (!await context.PaymentMethodTypes.AnyAsync())
        {
            await context.PaymentMethodTypes.AddRangeAsync(SeedData.paymentMethodTypes.ToArray());
            await context.SaveChangesAsync();

            return await context.PaymentMethodTypes
                .AsNoTracking()
                .ToListAsync();
        }
        return [];
    }

    private static async Task<List<Occupation>> SeedOccupationsAsync(DataContext context)
    {
        if (!await context.Occupations.AnyAsync())
        {
            await context.Occupations.AddRangeAsync(SeedData.Occupations);
            await context.SaveChangesAsync();

            return await context.Occupations
                .AsNoTracking()
                .ToListAsync();
        }
        return [];
    }
    
    private static async Task<List<MaritalStatus>> SeedMaritalStatusesAsync(DataContext context)
    {
        if (!await context.MaritalStatuses.AnyAsync())
        {
            await context.MaritalStatuses.AddRangeAsync(SeedData.MaritalStatuses);
            await context.SaveChangesAsync();

            return await context.MaritalStatuses
                .AsNoTracking()
                .ToListAsync();
        }
        return [];
    }

    private static async Task<List<ColorBlindness>> SeedColorBlindnessesAsync(DataContext context)
    {
        if (!await context.ColorBlindnesses.AnyAsync())
        {
            await context.ColorBlindnesses.AddRangeAsync(SeedData.ColorBlindnesses);
            await context.SaveChangesAsync();

            return await context.ColorBlindnesses
                .AsNoTracking()
                .ToListAsync();
        }
        return [];
    }

    private static async Task<List<EducationLevel>> SeedEducationLevelsAsync(DataContext context)
    {
        if (!await context.EducationLevels.AnyAsync())
        {
            await context.EducationLevels.AddRangeAsync(SeedData.EducationLevels);
            await context.SaveChangesAsync();

            return await context.EducationLevels
                .AsNoTracking()
                .ToListAsync();
        }
        return [];
    }

    private static async Task<List<RelativeType>> SeedRelativeTypesAsync(DataContext context)
    {
        if (!await context.RelativeTypes.AnyAsync())
        {
            await context.RelativeTypes.AddRangeAsync(SeedData.RelativeTypes);
            await context.SaveChangesAsync();

            return await context.RelativeTypes
                .AsNoTracking()
                .ToListAsync();
        }
        return [];
    }

    private static async Task<List<Disease>> SeedDiseasesAsync(DataContext context)
    {
        if (!await context.Diseases.AnyAsync())
        {
            await context.Diseases.AddRangeAsync(SeedData.Diseases);
            await context.SaveChangesAsync();

            return await context.Diseases
                .AsNoTracking()
                .ToListAsync();
        }
        return [];
    }

    private static async Task<List<Substance>> SeedSubstancesAsync(DataContext context)
    {
        if (!await context.Substances.AnyAsync())
        {
            await context.Substances.AddRangeAsync(SeedData.Substances);
            await context.SaveChangesAsync();

            return await context.Substances
                .AsNoTracking()
                .ToListAsync();
        }
        return [];
    }

    private static async Task<List<ConsumptionLevel>> SeedConsumptionLevelsAsync(DataContext context)
    {
        if (!await context.ConsumptionLevels.AnyAsync())
        {
            await context.ConsumptionLevels.AddRangeAsync(SeedData.ConsumptionLevels);
            await context.SaveChangesAsync();

            return await context.ConsumptionLevels
                .AsNoTracking()
                .ToListAsync();
        }
        return [];
    }
    private static async Task SeedMedicalInsuranceCompaniesAsync(DataContext context)
    {
        if (await context.MedicalInsuranceCompanies.AnyAsync()) return;
        await context.MedicalInsuranceCompanies.AddRangeAsync(SeedData.medicalInsuranceCompanies.ToArray());
        await context.SaveChangesAsync();
    }

    private static async Task<List<PaymentStatus>> SeedPaymentStatusesAsync(DataContext context)
    {
        if (!await context.PaymentStatuses.AnyAsync())
        {
            await context.PaymentStatuses.AddRangeAsync(SeedData.paymentStatuses);
            await context.SaveChangesAsync();

            return await context.PaymentStatuses
                .AsNoTracking()
                .ToListAsync();
        }
        return [];
    }

    public static async Task SeedRolesAndPermissionsAsync(RoleManager<AppRole> roleManager,
        IPermissionManager permissionManager)
    {
        if (await roleManager.Roles.AnyAsync()) return;

        var seedingRoles = SeedData.getRolesWithPermissions().ToList();

        int idx = 1;

        foreach (var role in seedingRoles)
        {
            Log.Information($"({idx++}/{seedingRoles.Count()}) creating role: {role.Name}.");
            await roleManager.CreateAsync(new(role.Name));
        }

        Log.Information($"{seedingRoles.Count()} roles created.");

        idx = 1;

        IEnumerable<AppPermission> seedingPermissions =
            seedingRoles.SelectMany(x => x.RolePermissions.Select(y => y.Permission)).Distinct().ToList();

        foreach (var permission in seedingPermissions)
        {
            Log.Information($"({idx++}/{seedingPermissions.Count()}) creating permission: {permission.Name}.");
            await permissionManager.CreateAsync(permission);
        }

        Log.Information($"{seedingPermissions.Count()} distinct permissions created.");

        // TODO
    }

    public static async Task SeedUsersAsync(UserManager<AppUser> userManager, DataContext context)
    {
        await SeedProductsAsync(context);
        await SeedServicesAsync(context);
        List<Specialty> specialties = await SeedSpecialtiesAsync(context);
        List<PaymentMethodType> paymentMethodTypes = await SeedPaymentMethodTypesAsync(context);
        List<EducationLevel> educationLevels = await SeedEducationLevelsAsync(context);
        List<Occupation> occupations = await SeedOccupationsAsync(context);
        List<MaritalStatus> maritalStatuses = await SeedMaritalStatusesAsync(context);
        List<ColorBlindness> colorBlindnesses = await SeedColorBlindnessesAsync(context);
        List<RelativeType> relativeTypes = await SeedRelativeTypesAsync(context);
        List<Disease> diseases = await SeedDiseasesAsync(context);
        List<Substance> substances = await SeedSubstancesAsync(context);
        List<ConsumptionLevel> consumptionLevels = await SeedConsumptionLevelsAsync(context);
        await SeedMedicalInsuranceCompaniesAsync(context);
        List<PaymentStatus> paymentStatuses = await SeedPaymentStatusesAsync(context);
        await SeedMexicoStates(context);
        
        if (await userManager.Users.AnyAsync()) return;

        var admin = new AppUser
        {
            UserName = "redacted+022@example.invalid",
            Email = "redacted+022@example.invalid",
            PhoneNumber = "8112089393",
            FirstName = "Ricardo",
            LastName = "Obregón",
            Sex = "Masculino",
            DateOfBirth = new DateOnly(2000, 5, 2),
            PhoneNumberCountryCode = "+52",
            UserAddresses = SeedData.GenerateUserAddresses(),
            UserPhoto = new UserPhoto()
            {
                Photo = new Photo
                {
                    Url = "https://res.cloudinary.com/dmjdskgd4/image/upload/v1711576883/Castesoft/logo_ytz4ej.png",
                    Name = "Foto chida",
                    Size = 2,
                }
            },
        };

        var doctor = new AppUser
        {
            UserName = "redacted+021@example.invalid",
            Email = "redacted+021@example.invalid",
            PhoneNumber = "8120800336",
            FirstName = "Ramiro",
            LastName = "Castellanos",
            Sex = "Masculino",
            DateOfBirth = new(1995, 10, 10),
            UserPhoto = new UserPhoto
            {
                Photo = new()
                {
                    Url =
                        "https://hips.hearstapps.com/hmg-prod/images/portrait-of-a-happy-young-doctor-in-his-clinic-royalty-free-image-1661432441.jpg?crop=0.66698xw:1xh;center,top&resize=1200:*",
                    PublicId = "avatars/ramiro_castellanos_barron",
                    Size = 24471, Name = "Foto_ramiro.png"
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
            DoctorClinics = SeedData.GenerateDoctorClinics(),
        };

        await userManager.CreateAsync(admin, "Pa$$w0rd");
        await userManager.CreateAsync(doctor, "Pa$$w0rd");

        await userManager.AddToRolesAsync(admin, ["Admin"]);
        await userManager.AddToRolesAsync(doctor, ["Doctor", "Patient"]);

        List<AppUser> patientsForSeeding = SeedData.GenerateUsersForSeeding(5000, Roles.Patient);
        int userIndex = 1;

        var roles = await context.Roles.ToListAsync();

        foreach (var user in patientsForSeeding)
        {
            List<string> roleNames = roles.Select(x => x.Name).Where(x => x == "Patient").ToList();
            var createUserResult = await userManager.CreateAsync(user, "Pa$$w0rd");
            if (!createUserResult.Succeeded) return;
            foreach (var roleName in roleNames)
            {
                var roleResult = await userManager.AddToRolesAsync(user, [roleName]);
                if (!roleResult.Succeeded) return;
            }

            Log.Information($"Seeding patient {$"{userIndex++}/{patientsForSeeding.Count()}",-15} ==> {user.Email}");
        }

        var patients = await userManager.Users
            .Include(x => x.UserRoles).ThenInclude(x => x.Role)
            .Where(x => x.UserRoles.Any(y => y.Role.Name == "Patient"))
            .ToListAsync();

        List<AppUser> doctorsForSeeding = SeedData.GenerateUsersForSeeding(500, Roles.Doctor);
        userIndex = 1;

        foreach (var user in doctorsForSeeding)
        {
            user.UserMedicalLicenses.Add(Utils.CreateUserMedicalLicense(specialties));
            user.DoctorPaymentMethodTypes.AddRange(Utils.CreateDoctorPaymentMethodTypes(paymentMethodTypes));
            user.DoctorWorkSchedules.AddRange(Utils.CreateDoctorWorkSchedules());
            
            List<string> roleNames = roles.Select(x => x.Name).Where(x => x == "Doctor").ToList();
            var createUserResult = await userManager.CreateAsync(user, "Pa$$w0rd");
            if (!createUserResult.Succeeded) return;
            foreach (var roleName in roleNames)
            {
                var roleResult = await userManager.AddToRolesAsync(user, [roleName, "Doctor"]);
                if (!roleResult.Succeeded) return;
            }

            Log.Information($"Seeding doctor {$"{userIndex++}/{doctorsForSeeding.Count()}",-15} ==> {user.Email}");
        }

        var doctors = await userManager.Users
            .Include(x => x.UserRoles).ThenInclude(x => x.Role)
            .Where(x => x.UserRoles.Any(y => y.Role.Name == "Doctor"))
            .ToListAsync();

        List<DoctorPatient> doctorPatientRelationships = [];

        foreach (var item in doctors)
        {
            int numberOfPatients = Random.Next(1, 20);
            var assignedPatients = patients.OrderBy(_ => Random.Next()).Take(numberOfPatients).ToList();

            foreach (var patient in assignedPatients)
            {
                if (!doctorPatientRelationships.Any(dp => dp.DoctorId == item.Id && dp.PatientId == patient.Id))
                {
                    doctorPatientRelationships.Add(new DoctorPatient
                    {
                        DoctorId = item.Id,
                        PatientId = patient.Id
                    });
                }
            }
        }

        context.DoctorPatients.AddRange(doctorPatientRelationships);
        await context.SaveChangesAsync();

        await SeedRandomDoctorData(context, userManager);
        await SeedMedicalRecordsAsync(context, userManager, educationLevels, occupations, maritalStatuses, colorBlindnesses,
            relativeTypes, diseases, substances, consumptionLevels);
    }

    private static async Task SeedProductsAsync(DataContext context)
    {
        if (await context.Products.AnyAsync()) return;
        await context.Products.AddRangeAsync(SeedData.products.ToArray());
        await context.SaveChangesAsync();
    }

    private static async Task SeedServicesAsync(DataContext context)
    {
        if (await context.Services.AnyAsync()) return;
        await context.Services.AddRangeAsync(SeedData.services.ToArray());
        await context.SaveChangesAsync();
    }


    private static async Task<List<DoctorNurse>> SeedDoctorNursesAsync(DataContext context,
        UserManager<AppUser> userManager, int doctorId)
    {
        var random = new Random();
        int numberOfNurses = random.Next(1, 16);
        List<AppUser> nurses = SeedData.GenerateUsersForSeeding(numberOfNurses, Roles.Nurse);

        foreach (var nurse in nurses)
        {
            var createUserResult = await userManager.CreateAsync(nurse, "Pa$$w0rd");
            if (!createUserResult.Succeeded)
            {
                Log.Error("Failed to create nurse user {NurseId} for doctor {DoctorId}", nurse.Id, doctorId);
                continue;
            }

            var addToRolesResult = await userManager.AddToRolesAsync(nurse, new[] { "Nurse", "Patient" });
            if (!addToRolesResult.Succeeded)
            {
                Log.Error("Failed to add roles to nurse user {NurseId} for doctor {DoctorId}", nurse.Id, doctorId);
                continue;
            }

            context.DoctorNurses.Add(new DoctorNurse(doctorId, nurse.Id));
        }

        await context.SaveChangesAsync();

        return await context.DoctorNurses.Where(x => x.DoctorId == doctorId).ToListAsync();
    }

    private static async Task<List<DoctorProduct>> SeedDoctorProductsAsync(DataContext context, AppUser doctor)
    {
        var random = new Random();
        var numberOfProductsToAdd = random.Next(5, 16);
        var products =
            SeedData.products.OrderBy(_ => Guid.NewGuid()).Take(numberOfProductsToAdd)
                .ToList();
        var doctorProducts = new List<DoctorProduct>();

        foreach (var product in products)
        {
            doctorProducts.Add(new DoctorProduct
            {
                DoctorId = doctor.Id,
                Product = new Product
                {
                    Name = product.Name,
                    Description = product.Description,
                    Dosage = product.Dosage,
                    Unit = product.Unit,
                    Manufacturer = product.Manufacturer,
                    LotNumber = product.LotNumber,
                    Price = product.Price,
                    Discount = product.Discount,
                }
            });
        }

        context.DoctorProducts.AddRange(doctorProducts);
        await context.SaveChangesAsync();

        return doctorProducts;
    }


    private static async Task<List<DoctorService>> SeedDoctorServicesAsync(DataContext context, AppUser doctor)
    {
        var random = new Random();
        var services = SeedData.services.ToList();

        foreach (var service in services.Take(random.Next(4, services.Count + 1)))
        {
            doctor.DoctorServices.Add(new DoctorService()
            {
                Service = new()
                {
                    Name = service.Name,
                    Description = service.Description,
                    Price = service.Price,
                    Discount = service.Discount,
                }
            });
        }

        await context.SaveChangesAsync();

        return await context.DoctorServices.Where(x => x.DoctorId == doctor.Id).ToListAsync();
    }


    private static async Task SeedRandomDoctorData(DataContext context, UserManager<AppUser> userManager)
    {
        var doctors = await GetDoctorsAsync(userManager);
        int userIndex = 0;

        foreach (var doctor in doctors)
        {
            Log.Information(
                $"Seeding random data for doctor {$"{userIndex++}/{doctors.Count - 1}",-15} ==> {doctor.Email}");
            await SeedDoctorDataAsync(context, userManager, doctor);
        }

        Log.Information("Saving randomDoctorData changes to database...");
        await context.SaveChangesAsync();
        Log.Information("Seeding process completed.");
    }

    private static async Task<List<AppUser>> GetDoctorsAsync(UserManager<AppUser> userManager)
    {
        return await userManager.Users
            .Include(x => x.UserRoles).ThenInclude(x => x.Role)
            .Where(x => x.UserRoles.Any(y => y.Role.Name == "Doctor"))
            .ToListAsync();
    }

    private static async Task SeedDoctorDataAsync(DataContext context, UserManager<AppUser> userManager, AppUser doctor)
    {
        var doctorNurses = await SeedDoctorNursesAsync(context, userManager, doctor.Id);
        // Log.Debug($"Seeded {doctorNurses.Count} nurses for doctor {doctor.Email}");

        var doctorProducts = await SeedDoctorProductsAsync(context, doctor);
        // Log.Debug($"Seeded {doctorProducts.Count} products for doctor {doctor.Email}");

        var doctorServices = await SeedDoctorServicesAsync(context, doctor);
        // Log.Debug($"Seeded {doctorServices.Count} services for doctor {doctor.Email}");

        if (doctor.Patients != null)
        {
            foreach (var patient in doctor.Patients.Select(x => x.Patient))
            {
                SeedPatientEventsAsync(doctor, patient, doctorNurses, doctorProducts, doctorServices);
            }
        }
    }

    private static async Task SeedMedicalRecordsAsync(DataContext context, UserManager<AppUser> userManager, List<EducationLevel> educationLevels, 
        List<Occupation> occupations, List<MaritalStatus> maritalStatuses, List<ColorBlindness> colorBlindnesses, List<RelativeType> relativeTypes,
        List<Disease> diseases, List<Substance> substances, List<ConsumptionLevel> consumptionLevels)
    {
        var users = await userManager.Users.ToListAsync();
        var mexicoStates = await context.States.ToListAsync();

        foreach (var user in users)
        {
            if (await context.UserMedicalRecords.AnyAsync(umr => umr.UserId == user.Id))
            {
                continue;
            }

            MedicalRecord medicalRecord = new()
            {
                PatientName = $"{user.FirstName} {user.LastName}",
                Age = Random.Shared.Next(18, 101),
                Sex = user.Sex,
                BirthPlace = mexicoStates[Random.Shared.Next(mexicoStates.Count)].Name,
                BirthDate = user.DateOfBirth.ToDateTime(TimeOnly.MinValue).ToUniversalTime(),
                YearsOfSchooling = Random.Shared.Next(6, 22),
                HandDominance = Random.Shared.Next(2) == 0 ? "Diestro" : "Zurdo",
                CurrentLivingSituation = GetRandomLivingSituation(),
                CurrentAddress = user.UserAddresses.FirstOrDefault(ua => ua.IsMain)?.Address?.Street ?? "No especificado",
                HomePhone = SeedData.GenerateMexicanPhoneNumber(),
                MobilePhone = user.PhoneNumber,
                Email = user.Email,
                HasCompanion = Random.Shared.Next(2) == 0,
                EconomicDependence = GetRandomEconomicDependence(),
                UsesGlassesOrHearingAid = Random.Shared.Next(2) == 0,
                Comments = "Comentarios iniciales del paciente.",
                MedicalRecordEducationLevel = new()
                {
                    EducationLevelId = educationLevels[Random.Shared.Next(educationLevels.Count)].Id,
                },
                MedicalRecordOccupation = new()
                {
                    OccupationId = occupations[Random.Shared.Next(occupations.Count)].Id,
                },
                MedicalRecordMaritalStatus = new()
                {
                    MaritalStatusId = maritalStatuses[Random.Shared.Next(maritalStatuses.Count)].Id,
                },
                MedicalRecordColorBlindness = new()
                {
                    ColorBlindnessId = colorBlindnesses[Random.Shared.Next(colorBlindnesses.Count)].Id,
                    IsPresent = Random.Shared.Next(2) == 0,
                }
            };

            for (int i = 0; i < Random.Shared.Next(3, 7); i++)
            {
                int id = relativeTypes[Random.Shared.Next(relativeTypes.Count)].Id;
                
                medicalRecord.MedicalRecordFamilyMembers.Add(new()
                {
                    FamilyMember = new()
                    {
                        Name = GetRandomName(),
                        Age = Random.Shared.Next(1, 90),
                        MedicalRecordFamilyMemberRelativeType = new(id)
                    }
                });
            }

            if (!medicalRecord.HasCompanion)
            {
                var randomOccupation = occupations[Random.Shared.Next(occupations.Count)];

                medicalRecord.MedicalRecordCompanion = new()
                {
                    Companion = new()
                    {
                        Name = GetRandomName(),
                        Age = Random.Shared.Next(18, 80),
                        Sex = Random.Shared.Next(2) == 0 ? "Masculino" : "Femenino",
                        Address = GetRandomAddress(),
                        HomePhone = SeedData.GenerateMexicanPhoneNumber(),
                        PhoneNumber = SeedData.GenerateMexicanPhoneNumber(),
                        Email = $"{SeedData.GetRandomFirstName("").ToLower()}.{SeedData.GetRandomLastName().ToLower()}@{SeedData.GetRandomEmailDomain()}.com",
                        CompanionRelativeType = new()
                        {
                            RelativeTypeId = relativeTypes[Random.Shared.Next(relativeTypes.Count)].Id
                        },
                        CompanionOccupation = new()
                        {
                            OccupationId = randomOccupation.Id
                        }
                    }
                };
            }

            var usedPersonalDiseaseIds = new HashSet<int>();
            var usedFamilyDiseaseIds = new HashSet<int>();
            var usedRelativeTypeIds = new HashSet<int>();

            for (int i = 0; i < Random.Shared.Next(3, 7); i++)
            {
                if (usedPersonalDiseaseIds.Count >= diseases.Count) break;

                int diseaseId;
                do
                {
                    diseaseId = diseases[Random.Shared.Next(diseases.Count)].Id;
                } while (usedPersonalDiseaseIds.Contains(diseaseId));

                usedPersonalDiseaseIds.Add(diseaseId);
                medicalRecord.MedicalRecordPersonalDiseases.Add(new()
                {
                    DiseaseId = diseaseId,
                    Description = "Descripción de la enfermedad personal."
                    
                });
            }

            for (int i = 0; i < Random.Shared.Next(3, 7); i++)
            {
                if (usedFamilyDiseaseIds.Count >= diseases.Count) break;
                if (usedRelativeTypeIds.Count >= relativeTypes.Count) break;

                int diseaseId;
                int relativeTypeId;
                do
                {
                    diseaseId = diseases[Random.Shared.Next(diseases.Count)].Id;
                } while (usedFamilyDiseaseIds.Contains(diseaseId));

                do
                {
                    relativeTypeId = relativeTypes[Random.Shared.Next(relativeTypes.Count)].Id;
                } while (usedRelativeTypeIds.Contains(relativeTypeId));

                usedFamilyDiseaseIds.Add(diseaseId);
                usedRelativeTypeIds.Add(relativeTypeId);
                medicalRecord.MedicalRecordFamilyDiseases.Add(new()
                {
                    DiseaseId = diseaseId,
                    RelativeTypeId = relativeTypeId,
                    Description = "Descripción de la enfermedad familiar."
                });
            }

            var usedSubstances = new HashSet<(int SubstanceId, int ConsumptionLevelId)>();

            for (int i = 0; i < Random.Shared.Next(3, 7); i++)
            {
                if (usedSubstances.Count >= substances.Count * consumptionLevels.Count) break;

                int substanceId, consumptionLevelId;
                do
                {
                    substanceId = substances[Random.Shared.Next(substances.Count)].Id;
                    consumptionLevelId = consumptionLevels[Random.Shared.Next(consumptionLevels.Count)].Id;
                } while (usedSubstances.Contains((substanceId, consumptionLevelId)));

                usedSubstances.Add((substanceId, consumptionLevelId));

                medicalRecord.MedicalRecordSubstances.Add(new()
                {
                    SubstanceId = substanceId,
                    ConsumptionLevelId = consumptionLevelId,
                    StartAge = Random.Shared.Next(12, 30),
                    EndAge = Random.Shared.Next(30, 60),
                    IsCurrent = Random.Shared.Next(2) == 0
                });
            }

            context.MedicalRecords.Add(medicalRecord);

            context.UserMedicalRecords.Add(new()
            {
                UserId = user.Id,
                MedicalRecord = medicalRecord
            });
        }

        await context.SaveChangesAsync();
    }

    private static string GetRandomLivingSituation()
    {
        string[] livingSituations = ["Solo", "Con familia", "Con compañeros de piso", "En un hogar de ancianos", "Otro"];
        return livingSituations[Random.Shared.Next(livingSituations.Length)];
    }

    private static string GetRandomEconomicDependence()
    {
        string[] dependencies = ["Independiente", "Dependiente de familia", "Asistencia gubernamental", "Otro"];
        return dependencies[Random.Shared.Next(dependencies.Length)];
    }

    private static string GetRandomName()
    {
        return $"{SeedData.GetRandomFirstName("")} {SeedData.GetRandomLastName()}";
    }

    private static string GetRandomAddress()
    {
        return $"{SeedData.GetRandomStreet()} {Random.Shared.Next(100, 9999)}, {SeedData.GetRandomCity()}";
    }

    private static string GetRandomFamilyMember()
    {
        string[] familyMembers = ["Madre", "Padre", "Hermano", "Hermana", "Abuelo", "Abuela", "Tío", "Tía", "Primo", "Prima"];
        return familyMembers[Random.Shared.Next(familyMembers.Length)];
    }

    private static void SeedPatientEventsAsync(AppUser doctor, AppUser patient,
        List<DoctorNurse> doctorNurses, List<DoctorProduct> doctorProducts, List<DoctorService> doctorServices)
    {
        for (int i = 2; i < Random.Next(2, 11); i++)
        {
            var newPatientEvent = CreatePatientEvent(doctor, doctorServices, patient);
            AddNursesToEvent(newPatientEvent, doctorNurses);
            AddPrescriptionsToEvent(newPatientEvent, doctorProducts, patient, doctor);
            patient.PatientEvents.Add(newPatientEvent);
        }
    }

    private static PatientEvent CreatePatientEvent(AppUser doctor, List<DoctorService> doctorServices, AppUser patient)
    {
        if (doctorServices == null || doctorServices.Count == 0)
        {
            throw new ArgumentException("Doctor services list cannot be null or empty", nameof(doctorServices));
        }

        var eventDate = DateGenerator.GenerateRandomDate(DateTime.UtcNow.Year, DateTime.UtcNow.Month);

        Service selectedService = doctorServices[Random.Next(doctorServices.Count)].Service;

        var isMainClinic = Random.Next(0, 2) > 0;
        var randomClinic = doctor.DoctorClinics.FirstOrDefault(x => x.IsMain == isMainClinic)?.Clinic;

        PatientEvent newPatientEvent = new() {
            Event = new() {
                DoctorEvent = new(doctor),
                DateFrom = eventDate.ToUniversalTime(),
                DateTo = eventDate.AddHours(1).ToUniversalTime(),
                EventService = new(selectedService),
            }
        };

        newPatientEvent.Event.EventPayments = SeedEventPayments.GetEventPayments(newPatientEvent.Event, patient);
        newPatientEvent.Event.EventPaymentStatus = new()
        {
            PaymentStatus = SeedEventPayments.GetPaymentStatus(newPatientEvent.Event)
        };

        if (randomClinic != null) newPatientEvent.Event.EventClinic = new (randomClinic);

        return newPatientEvent;
    }


    private static void AddNursesToEvent(PatientEvent patientEvent, List<DoctorNurse> doctorNurses)
    {
        if (Random.Next(0, 2) > 0)
        {
            var randomNurses = doctorNurses.Select(x => x.Nurse).Take(Random.Next(1, 4)).ToList();

            foreach (var nurse in randomNurses)
            {
                patientEvent.Event.NurseEvents.Add(new NurseEvent { Nurse = nurse });
            }
        }
    }

    private static void AddPrescriptionsToEvent(PatientEvent patientEvent, List<DoctorProduct> doctorProducts,
        AppUser patient, AppUser doctor)
    {
        if (Random.Next(0, 2) > 0)
        {
            for (int j = 1; j < Random.Next(1, 4); j++)
            {
                var newPrescriptionItems = new List<PrescriptionItem>();
                var existingMedicineIds = new HashSet<int>();
                var productIds = doctorProducts.Select(x => x.Product.Id).ToList();

                for (int k = 1; k < Random.Next(1, 4); k++)
                {
                    if (existingMedicineIds.Count >= productIds.Count)
                    {
                        Log.Warning($"All products have been used for patient {patient.Id}");
                        break;
                    }

                    int randomMedicineId;
                    do
                    {
                        randomMedicineId = productIds[Random.Next(productIds.Count)];
                    } while (existingMedicineIds.Contains(randomMedicineId));

                    existingMedicineIds.Add(randomMedicineId);

                    var randomMedicine = doctorProducts.Select(x => x.Product)
                        .FirstOrDefault(p => p.Id == randomMedicineId);
                    if (randomMedicine == null)
                    {
                        Log.Error($"Failed to find medicine with ID {randomMedicineId}");
                        continue;
                    }

                    var newPrescriptionItem = new PrescriptionItem
                    {
                        ItemId = randomMedicineId,
                        Item = randomMedicine,
                        Quantity = Random.Next(1, 10),
                        Dosage = "500",
                        Instructions = "Tomar 1 tableta cada 6 horas",
                        Notes = "Según necesidad para la fiebre y el dolor.",
                        Unit = "mg"
                    };

                    newPrescriptionItems.Add(newPrescriptionItem);
                }

                patientEvent.Event.EventPrescriptions.Add(new EventPrescription
                {
                    Prescription = new Prescription
                    {
                        ExchangeAmount = Random.Next(1, 6),
                        Notes = "Infección de las vías respiratorias superiores (posiblemente viral).",
                        PatientPrescription = new PatientPrescription { Patient = patient },
                        DoctorPrescription = new DoctorPrescription { Doctor = doctor },
                        PrescriptionItems = newPrescriptionItems,
                    }
                });
            }
        }
    }
}
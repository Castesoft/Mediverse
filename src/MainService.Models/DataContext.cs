using System.Reflection;
using MainService.Models.Entities;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace MainService.Models;

public class DataContext(DbContextOptions<DataContext> options) : IdentityDbContext<AppUser, AppRole, int,
    IdentityUserClaim<int>, AppUserRole, IdentityUserLogin<int>,
    IdentityRoleClaim<int>, IdentityUserToken<int>>(options)
{
    public DbSet<Photo> Photos { get; set; }
    public DbSet<UserPhoto> UserPhotos { get; set; }
    public DbSet<AppPermission> Permissions { get; set; }
    public DbSet<AppUserPermission> UserPermissions { get; set; }
    public DbSet<Service> Services { get; set; }
    public DbSet<Product> Products { get; set; }
    public DbSet<DoctorPhone> DoctorPhones { get; set; }
    public DbSet<DoctorLink> DoctorLinks { get; set; }
    public DbSet<DoctorClinic> DoctorClinics { get; set; }
    public DbSet<ClinicNurse> ClinicNurses { get; set; }
    public DbSet<Address> Addresses { get; set; }
    public DbSet<DoctorPatient> DoctorPatients { get; set; }
    public DbSet<DoctorService> DoctorServices { get; set; }
    public DbSet<DoctorProduct> DoctorProducts { get; set; }
    public DbSet<DoctorNurse> DoctorNurses { get; set; }
    public DbSet<Event> Events { get; set; }
    public DbSet<Prescription> Prescriptions { get; set; }
    public DbSet<PrescriptionItem> PrescriptionItems { get; set; }
    public DbSet<OrderItem> OrderItems { get; set; }
    public DbSet<Order> Orders { get; set; }
    public DbSet<UserPaymentMethod> UserPaymentMethods { get; set; }
    public DbSet<UserTaxRegime> UserTaxRegimes { get; set; }
    public DbSet<UserMedicalLicense> UserMedicalLicenses { get; set; }
    public DbSet<MedicalLicense> MedicalLicenses { get; set; }
    public DbSet<DoctorPaymentMethodType> DoctorPaymentMethodTypes { get; set; }
    public DbSet<PaymentMethod> PaymentMethods { get; set; }
    public DbSet<MedicalLicenseDocument> MedicalLicenseDocuments { get; set; }
    public DbSet<Document> Documents { get; set; }
    public DbSet<Specialty> Specialties { get; set; }
    public DbSet<PaymentMethodType> PaymentMethodTypes { get; set; }


    protected override void OnModelCreating(ModelBuilder builder)
    {
        base.OnModelCreating(builder);
        builder.ApplyConfigurationsFromAssembly(Assembly.GetExecutingAssembly());

        if (Database.ProviderName == "Microsoft.EntityFrameworkCore.Sqlite")
        {
            foreach (var entityType in builder.Model.GetEntityTypes())
            {
                var properties = entityType.ClrType.GetProperties().Where(p => p.PropertyType == typeof(decimal));

                foreach (var property in properties)
                {
                    builder.Entity(entityType.Name).Property(property.Name).HasConversion<double>();
                }
            }
        }
    }
}
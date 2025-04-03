using System.Reflection;
using MainService.Models.Entities;
using MainService.Models.Entities.Addresses;
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
    public DbSet<ClinicLogo> ClinicLogos { get; set; }
    public DbSet<ClinicPhoto> ClinicPhotos { get; set; }
    public DbSet<DoctorClinic> DoctorClinics { get; set; }
    public DbSet<ClinicNurse> ClinicNurses { get; set; }
    public DbSet<Address> Addresses { get; set; }
    public DbSet<UserAddress> UserAddresses { get; set; }
    public DbSet<DoctorPatient> DoctorPatients { get; set; }
    public DbSet<DoctorService> DoctorServices { get; set; }
    public DbSet<DoctorProduct> DoctorProducts { get; set; }
    public DbSet<DoctorNurse> DoctorNurses { get; set; }
    public DbSet<Event> Events { get; set; }
    public DbSet<Prescription> Prescriptions { get; set; }
    public DbSet<PrescriptionProduct> PrescriptionItems { get; set; }
    public DbSet<OrderProduct> OrderItems { get; set; }
    public DbSet<Order> Orders { get; set; }
    public DbSet<OrderHistory> OrderHistories { get; set; }
    public DbSet<UserTaxRegime> UserTaxRegimes { get; set; }
    public DbSet<UserMedicalLicense> UserMedicalLicenses { get; set; }
    public DbSet<MedicalLicense> MedicalLicenses { get; set; }
    public DbSet<DoctorPaymentMethodType> DoctorPaymentMethodTypes { get; set; }
    public DbSet<PaymentMethod> PaymentMethods { get; set; }
    public DbSet<MedicalLicenseDocument> MedicalLicenseDocuments { get; set; }
    public DbSet<Document> Documents { get; set; }
    public DbSet<Specialty> Specialties { get; set; }
    public DbSet<PaymentMethodType> PaymentMethodTypes { get; set; }
    public DbSet<MedicalLicenseSubSpecialty> MedicalLicenseSubSpecialties { get; set; }
    public DbSet<SpecialitySubSpecialty> SpecialitySubSpecialties { get; set; }
    public DbSet<SubSpecialty> SubSpecialties { get; set; }
    public DbSet<State> States { get; set; }
    public DbSet<City> Cities { get; set; }
    public DbSet<Neighborhood> Neighborhoods { get; set; }
    public DbSet<MedicalInsuranceCompany> MedicalInsuranceCompanies { get; set; }
    public DbSet<UserMedicalInsuranceCompany> UserMedicalInsuranceCompanies { get; set; }
    public DbSet<WorkSchedule> WorkSchedules { get; set; }
    public DbSet<DoctorWorkSchedule> DoctorWorkSchedules { get; set; }
    public DbSet<Payment> Payments { get; set; }
    public DbSet<DoctorReview> DoctorReviews { get; set; }
    public DbSet<UserReview> UserReviews { get; set; }
    public DbSet<Review> Reviews { get; set; }
    public DbSet<MedicalRecord> MedicalRecords { get; set; }
    public DbSet<UserMedicalRecord> UserMedicalRecords { get; set; }
    public DbSet<WorkScheduleSettings> WorkScheduleSettings { get; set; }
    public DbSet<EducationLevel> EducationLevels { get; set; }
    public DbSet<MedicalRecordEducationLevel> MedicalRecordEducationLevels { get; set; }
    public DbSet<Occupation> Occupations { get; set; }
    public DbSet<MedicalRecordOccupation> MedicalRecordOccupations { get; set; }
    public DbSet<Substance> Substances { get; set; }
    public DbSet<ConsumptionLevel> ConsumptionLevels { get; set; }
    public DbSet<MedicalRecordSubstance> MedicalRecordSubstances { get; set; }
    public DbSet<Disease> Diseases { get; set; }
    public DbSet<MedicalRecordPersonalDisease> MedicalRecordPersonalDiseases { get; set; }
    public DbSet<MedicalRecordFamilyDisease> MedicalRecordFamilyDiseases { get; set; }
    public DbSet<Companion> Companions { get; set; }
    public DbSet<MedicalRecordCompanion> MedicalRecordCompanions { get; set; }
    public DbSet<CompanionRelativeType> CompanionRelativeTypes { get; set; }
    public DbSet<CompanionOccupation> CompanionOccupations { get; set; }
    public DbSet<MaritalStatus> MaritalStatuses { get; set; }
    public DbSet<MedicalRecordMaritalStatus> MedicalRecordMaritalStatuses { get; set; }
    public DbSet<ColorBlindness> ColorBlindnesses { get; set; }
    public DbSet<MedicalRecordColorBlindness> MedicalRecordColorBlindnesses { get; set; }
    public DbSet<FamilyMember> FamilyMembers { get; set; }
    public DbSet<RelativeType> RelativeTypes { get; set; }
    public DbSet<MedicalRecordFamilyMember> MedicalRecordFamilyMembers { get; set; }
    public DbSet<MedicalRecordFamilyMemberRelativeType> MedicalRecordFamilyMemberRelativeTypes { get; set; }
    public DbSet<DeliveryStatus> DeliveryStatuses { get; set; }
    public DbSet<OrderStatus> OrderStatuses { get; set; }
    public DbSet<Warehouse> Warehouses { get; set; }
    public DbSet<WarehouseProduct> WarehouseProducts { get; set; }
    public DbSet<UserSubscription> Subscriptions { get; set; }
    public DbSet<SubscriptionHistory> SubscriptionHistories { get; set; }
    public DbSet<SubscriptionPlan> SubscriptionPlans { get; set; }
    public DbSet<UserNotification> UserNotifications { get; set; }
    public DbSet<Notification> Notifications { get; set; }
    public DbSet<SubscriptionCancellation> SubscriptionCancellations { get; set; }
    public DbSet<ManualPaymentDetail> ManualPaymentDetails { get; set; }
    public DbSet<PaymentMethodPreference> PaymentMethodPreferences { get; set; }

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
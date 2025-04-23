using AutoMapper;
using MainService.Core.Interfaces.Data;
using MainService.Core.Interfaces.Services;
using MainService.Infrastructure.Data;
using MainService.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Storage;

namespace MainService.Infrastructure.Services;

public class UnitOfWork(DataContext context, IMapper mapper, IGoogleService googleService) : IUnitOfWork
{
    public IProductRepository ProductRepository => new ProductRepository(context, mapper);
    public IDocumentRepository DocumentRepository => new DocumentRepository(context, mapper);
    public IPaymentMethodTypeRepository PaymentMethodTypeRepository => new PaymentMethodTypeRepository(context, mapper);

    public IMedicalInsuranceCompanyRepository MedicalInsuranceCompanyRepository =>
        new MedicalInsuranceCompanyRepository(context, mapper);

    public IMedicalLicenseRepository MedicalLicenseRepository => new MedicalLicenseRepository(context, mapper);

    public ISpecialtyRepository SpecialtyRepository => new SpecialtyRepository(context, mapper);
    public IDiseaseRepository DiseaseRepository => new DiseaseRepository(context, mapper);
    public ISubstanceRepository SubstanceRepository => new SubstanceRepository(context, mapper);
    public IOccupationRepository OccupationRepository => new OccupationRepository(context, mapper);
    public IMaritalStatusRepository MaritalStatusRepository => new MaritalStatusRepository(context, mapper);
    public IEducationLevelRepository EducationLevelRepository => new EducationLevelRepository(context, mapper);
    public IColorBlindnessRepository ColorBlindnessRepository => new ColorBlindnessRepository(context, mapper);
    public IRelativeTypeRepository RelativeTypeRepository => new RelativeTypeRepository(context, mapper);
    public IConsumptionLevelRepository ConsumptionLevelRepository => new ConsumptionLevelRepository(context, mapper);
    public IServiceRepository ServiceRepository => new ServiceRepository(context, mapper);
    public IPhotoRepository PhotoRepository => new PhotoRepository(context, mapper);
    public IUserRepository UserRepository => new UserRepository(context, mapper);
    public IPatientRepository PatientRepository => new PatientRepository(context, mapper);
    public INurseRepository NurseRepository => new NurseRepository(context, mapper);
    public IDeliveryStatusRepository DeliveryStatusRepository => new DeliveryStatusRepository(context, mapper);
    public IOrderStatusRepository OrderStatusRepository => new OrderStatusRepository(context, mapper);
    public IAddressRepository AddressRepository => new AddressRepository(context, mapper);
    public IClinicRepository ClinicRepository => new ClinicRepository(context, mapper);
    public IEventRepository EventRepository => new EventRepository(context, mapper);
    public IPrescriptionRepository PrescriptionRepository => new PrescriptionRepository(context, mapper);
    public IOrderRepository OrderRepository => new OrderRepository(context, mapper);
    public ISearchRepository SearchRepository => new SearchRepository(context, mapper, googleService);
    public IRoleRepository RoleRepository => new RoleRepository(context, mapper);
    public IWarehouseRepository WarehouseRepository => new WarehouseRepository(context, mapper);
    public IPaymentRepository PaymentRepository => new PaymentRepository(context, mapper);
    public ISubscriptionRepository SubscriptionRepository => new SubscriptionRepository(context, mapper);

    public ISubscriptionHistoryRepository SubscriptionHistoryRepository =>
        new SubscriptionHistoryRepository(context, mapper);

    public ISubscriptionPlanRepository SubscriptionPlanRepository => new SubscriptionPlanRepository(context);
    public IPaymentMethodRepository PaymentMethodRepository => new PaymentMethodRepository(context, mapper);

    public ISubscriptionCancellationRepository SubscriptionCancellationRepository =>
        new SubscriptionCancellationRepository(context);

    public IUserNotificationRepository UserNotificationRepository => new UserNotificationRepository(context, mapper);
    public IManualPaymentDetailRepository ManualPaymentDetailRepository => new ManualPaymentDetailRepository(context);

    public IPaymentMethodPreferenceRepository PaymentMethodPreferenceRepository =>
        new PaymentMethodPreferenceRepository(context, mapper);

    public IUserMedicalRecordRepository UserMedicalRecordRepository => new UserMedicalRecordRepository(context, mapper);
    public IUserReviewRepository UserReviewRepository => new UserReviewRepository(context, mapper);
    public IDoctorReviewRepository DoctorReviewRepository => new DoctorReviewRepository(context, mapper);

    public IDoctorPrescriptionRepository DoctorPrescriptionRepository =>
        new DoctorPrescriptionRepository(context, mapper);

    public IDoctorOrderRepository DoctorOrderRepository => new DoctorOrderRepository(context, mapper);
    public IDoctorEventRepository DoctorEventRepository => new DoctorEventRepository(context, mapper);
    public IDoctorNurseRepository DoctorNurseRepository => new DoctorNurseRepository(context, mapper);
    public IPatientEventRepository PatientEventRepository => new PatientEventRepository(context, mapper);

    public IPatientPrescriptionRepository PatientPrescriptionRepository =>
        new PatientPrescriptionRepository(context, mapper);

    public IPatientOrderRepository PatientOrderRepository => new PatientOrderRepository(context, mapper);
    public INurseEventRepository NurseEventRepository => new NurseEventRepository(context, mapper);
    public IInvitationRepository InvitationRepository => new InvitationRepository(context);
    
    public async Task<bool> Complete() => await context.SaveChangesAsync() > 0;

    public Task<IDbContextTransaction> BeginTransactionAsync()
    {
        return context.Database.BeginTransactionAsync();
    }

    public void DetachEntity<T>(T entity) where T : class => context.Entry(entity).State = EntityState.Detached;
    public bool HasChanges() => context.ChangeTracker.HasChanges();
}
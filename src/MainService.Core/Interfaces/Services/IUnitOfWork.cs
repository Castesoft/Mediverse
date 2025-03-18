using MainService.Core.Interfaces.Data;

namespace MainService.Core.Interfaces.Services;

public interface IUnitOfWork
{
    IDiseaseRepository DiseaseRepository { get; }
    IPaymentMethodTypeRepository PaymentMethodTypeRepository { get; }
    IMedicalInsuranceCompanyRepository MedicalInsuranceCompanyRepository { get; }
    IMedicalLicenseRepository MedicalLicenseRepository { get; }
    ISubstanceRepository SubstanceRepository { get; }
    IOccupationRepository OccupationRepository { get; }
    IMaritalStatusRepository MaritalStatusRepository { get; }
    IEducationLevelRepository EducationLevelRepository { get; }
    IColorBlindnessRepository ColorBlindnessRepository { get; }
    IRelativeTypeRepository RelativeTypeRepository { get; }
    IConsumptionLevelRepository ConsumptionLevelRepository { get; }
    IProductRepository ProductRepository { get; }
    IServiceRepository ServiceRepository { get; }
    IPhotoRepository PhotoRepository { get; }
    IUserRepository UserRepository { get; }
    IPatientRepository PatientRepository { get; }
    INurseRepository NurseRepository { get; }
    IDeliveryStatusRepository DeliveryStatusRepository { get; }
    IOrderStatusRepository OrderStatusRepository { get; }
    IAddressRepository AddressRepository { get; }
    IClinicRepository ClinicRepository { get; }
    IEventRepository EventRepository { get; }
    IPrescriptionRepository PrescriptionRepository { get; }
    IOrderRepository OrderRepository { get; }
    ISpecialtyRepository SpecialtyRepository { get; }
    ISearchRepository SearchRepository { get; }
    IDocumentRepository DocumentRepository { get; }
    IRoleRepository RoleRepository { get; }
    IWarehouseRepository WarehouseRepository { get; }
    IPaymentRepository PaymentRepository { get; }
    IPaymentMethodRepository PaymentMethodRepository { get; }
    ISubscriptionRepository SubscriptionRepository { get; }
    ISubscriptionHistoryRepository SubscriptionHistoryRepository { get; }
    ISubscriptionPlanRepository SubscriptionPlanRepository { get; }
    ISubscriptionCancellationRepository SubscriptionCancellationRepository { get; }
    IUserNotificationRepository UserNotificationRepository { get; }
    Task<bool> Complete();

    bool HasChanges();
    void DetachEntity<T>(T entity) where T : class;
}
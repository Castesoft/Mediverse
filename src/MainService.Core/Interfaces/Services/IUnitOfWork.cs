using MainService.Core.Interfaces.Data;

namespace MainService.Core.Interfaces.Services;
public interface IUnitOfWork
{
    IDiseaseRepository DiseaseRepository { get; }
    IPaymentMethodTypeRepository PaymentMethodTypeRepository { get; }
    IMedicalInsuranceCompanyRepository MedicalInsuranceCompanyRepository { get; }
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
    IAddressRepository AddressRepository { get; }
    IEventRepository EventRepository { get; }
    IPrescriptionRepository PrescriptionRepository { get; }
    IOrderRepository OrderRepository { get; }
    ISpecialtyRepository SpecialtyRepository { get; }
    ISearchRepository SearchRepository { get; }
    IDocumentRepository DocumentRepository { get; }
    Task<bool> Complete();
    
    bool HasChanges();
    void DetachEntity<T>(T entity) where T : class;
}
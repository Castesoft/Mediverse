using AutoMapper;
using MainService.Core.Interfaces.Data;
using MainService.Core.Interfaces.Services;
using MainService.Infrastructure.Data;
using MainService.Models;
using Microsoft.EntityFrameworkCore;

namespace MainService.Infrastructure.Services;

public class UnitOfWork(DataContext context, IMapper mapper, IGoogleService googleService) : IUnitOfWork
{
    public IProductRepository ProductRepository => new ProductRepository(context, mapper);
    public IPaymentMethodTypeRepository PaymentMethodTypeRepository => new PaymentMethodTypeRepository(context, mapper);
    public IMedicalInsuranceCompanyRepository MedicalInsuranceCompanyRepository => new MedicalInsuranceCompanyRepository(context, mapper);
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
    public IAddressRepository AddressRepository => new AddressRepository(context, mapper);
    public IEventRepository EventRepository => new EventRepository(context, mapper);
    public IPrescriptionRepository PrescriptionRepository => new PrescriptionRepository(context, mapper);
    public IOrderRepository OrderRepository => new OrderRepository(context, mapper);
    public ISearchRepository SearchRepository => new SearchRepository(context, mapper, googleService);

    public async Task<bool> Complete() => await context.SaveChangesAsync() > 0;
    public void DetachEntity<T>(T entity) where T : class => context.Entry(entity).State = EntityState.Detached;
    public bool HasChanges() => context.ChangeTracker.HasChanges();
}

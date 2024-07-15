using AutoMapper;
using MainService.Core.Interfaces.Data;
using MainService.Core.Interfaces.Services;
using MainService.Infrastructure.Data;
using MainService.Models;
using Microsoft.EntityFrameworkCore;

namespace MainService.Infrastructure.Services;

public class UnitOfWork(DataContext context, IMapper mapper) : IUnitOfWork
{
    public IProductRepository ProductRepository => new ProductRepository(context, mapper);
    public IServiceRepository ServiceRepository => new ServiceRepository(context, mapper);
    public IPhotoRepository PhotoRepository => new PhotoRepository(context, mapper);
    public IUserRepository UserRepository => new UserRepository(context, mapper);
    public IAddressRepository AddressRepository => new AddressRepository(context, mapper);
    public IEventRepository EventRepository => new EventRepository(context, mapper);

    public async Task<bool> Complete() => await context.SaveChangesAsync() > 0;
    public void DetachEntity<T>(T entity) where T : class => context.Entry(entity).State = EntityState.Detached;
    public bool HasChanges() => context.ChangeTracker.HasChanges();
}

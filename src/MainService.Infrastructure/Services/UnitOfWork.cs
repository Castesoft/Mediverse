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

    public async Task<bool> Complete()
    {
        return await context.SaveChangesAsync() > 0;
    }

    public void DetachEntity<T>(T entity) where T : class
    {
        context.Entry(entity).State = EntityState.Detached;
    }

    public bool HasChanges()
    {
        return context.ChangeTracker.HasChanges();
    }
}

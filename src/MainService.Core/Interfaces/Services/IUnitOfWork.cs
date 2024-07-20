using MainService.Core.Interfaces.Data;

namespace MainService.Core.Interfaces.Services;
public interface IUnitOfWork
{
    IProductRepository ProductRepository { get; }
    IServiceRepository ServiceRepository { get; }
    IPhotoRepository PhotoRepository { get; }
    IUserRepository UserRepository { get; }
    IAddressRepository AddressRepository { get; }
    IEventRepository EventRepository { get; }
    IPrescriptionRepository PrescriptionRepository { get; }
    Task<bool> Complete();
    
    bool HasChanges();
    void DetachEntity<T>(T entity) where T : class;
}
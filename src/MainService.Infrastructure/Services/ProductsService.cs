using MainService.Core.Interfaces.Services;
using MainService.Models.Entities;

namespace MainService.Infrastructure.Services;
public class ProductsService(IUnitOfWork uow) : IProductsService
{
    public async Task<bool> DeleteAsync(Product item)
    {
        // Elimina todas las entidades relacionadas
        // if (!await DeletePhotosAsync(advice)) return false;
        // if (!await DeleteInformationAsync(advice)) return false;
        
        var itemToDelete = await uow.ProductRepository.GetByIdAsync(item.Id);

        uow.ProductRepository.Delete(itemToDelete);

        if (!await uow.Complete()) return false;
        
        return true;
    }
}
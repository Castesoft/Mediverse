using MainService.Models.Entities;

namespace MainService.Core.Interfaces.Services;
public interface IProductsService
{
Task<bool> DeleteAsync(Product item);
}
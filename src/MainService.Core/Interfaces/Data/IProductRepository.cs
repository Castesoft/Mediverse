using MainService.Core.DTOs.Products;
using MainService.Core.Helpers.Pagination;
using MainService.Core.Helpers.Params;
using MainService.Models.Entities;

namespace MainService.Core.Interfaces.Data;
public interface IProductRepository
{
    void Add(Product item);
    void Delete(Product item);
    Task<Product> GetByIdAsync(int id);
    Task<ProductDto> GetDtoByIdAsync(int id);
    Task<Product> GetByIdAsNoTrackingAsync(int id);
    Task<List<Product>> GetAllAsync();
    Task<List<ProductDto>> GetAllDtoAsync();
    Task<PagedList<ProductDto>> GetPagedListAsync(ProductParams param);
}
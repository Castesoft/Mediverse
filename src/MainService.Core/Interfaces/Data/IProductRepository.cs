using System.Security.Claims;
using MainService.Core.DTOs.Products;
using MainService.Core.Helpers.Pagination;
using MainService.Core.Helpers.Params;
using MainService.Models.Entities;
using MainService.Models.Entities.Aggregate;

namespace MainService.Core.Interfaces.Data;
public interface IProductRepository
{
    void Add(Product item);
    void Delete(Product item);
    Task<Product> GetByIdAsync(int id);
    Task<Product> GetByNameAsync(string name, ClaimsPrincipal user);
    Task<List<ProductSummaryDto>> GetSummaryDtosAsync(ProductParams param, ClaimsPrincipal user);
    Task<bool> ExistsAsync(int id, ClaimsPrincipal user);
    Task<ProductDto> GetDtoByIdAsync(int id);
    Task<Product> GetByIdAsNoTrackingAsync(int id);
    Task<List<Product>> GetAllAsync();
    Task<List<ProductDto>> GetAllDtoAsync(ProductParams param, ClaimsPrincipal user);
    Task<PagedList<ProductDto>> GetPagedListAsync(ProductParams param, ClaimsPrincipal user);
    Task<List<OptionDto>> GetOptionsAsync(ProductParams param);
    Task<bool> ExistsByIdAsync(int id);
    Task<bool> DoctorHasProductOrIsGlobalAsync(int doctorId, int productId);
    Task<bool> IsGlobalAsync(int productId);
    Task<bool> DoctorHasProductAsync(int doctorId, int productId);
}
using System.Security.Claims;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using MainService.Core.Extensions;
using MainService.Core.DTOs.Products;
using MainService.Core.Helpers.Pagination;
using MainService.Core.Helpers.Params;
using MainService.Core.Interfaces.Data;
using MainService.Models;
using MainService.Models.Entities;
using Microsoft.EntityFrameworkCore;
using MainService.Models.Entities.Aggregate;
using MainService.Infrastructure.QueryExtensions;

namespace MainService.Infrastructure.Data;

public class ProductRepository(DataContext context, IMapper mapper) : IProductRepository
{
    public void Add(Product item) => context.Products.Add(item);
    public void Delete(Product item) => context.Products.Remove(item);
    public void Update(Product item) => context.Products.Update(item);

    public async Task<List<Product>> GetAllAsync()
    {
        return await context.Products.ToListAsync();
    }

    public async Task<List<ProductDto>> GetAllDtoAsync(ProductParams param, ClaimsPrincipal user)
    {
        var query = context.Products
            .AsNoTracking()
            .ProjectTo<ProductDto>(mapper.ConfigurationProvider);

        return await query.ToListAsync();
    }

    public async Task<Product?> GetByIdAsNoTrackingAsync(int id) =>
        await context.Products
            .Includes()
            .AsNoTracking()
            .SingleOrDefaultAsync(x => x.Id == id);

    public async Task<Product?> GetByIdAsync(int id) =>
        await context.Products
            .Includes()
            .SingleOrDefaultAsync(x => x.Id == id);

    public async Task<Product?> GetByNameAsync(string name, ClaimsPrincipal user) => await context.Products
        .Includes()
        .Where(x => x.DoctorProduct.DoctorId == user.GetUserId())
        .SingleOrDefaultAsync(x => x.Name == name);

    public async Task<bool> ExistsAsync(int id, ClaimsPrincipal user)
    {
        return await context.Products
            .Includes()
            .AnyAsync(x => x.Id == id && x.DoctorProduct.DoctorId == user.GetUserId());
    }

    public async Task<ProductDto?> GetDtoByIdAsync(int id)
    {
        var item = await context.Products
            .Includes()
            .AsNoTracking()
            .ProjectTo<ProductDto>(mapper.ConfigurationProvider)
            .SingleOrDefaultAsync(x => x.Id == id);

        return item;
    }

    public async Task<List<ProductSummaryDto>> GetSummaryDtosAsync(ProductParams param, ClaimsPrincipal user)
    {
        var query = context.Products
            .Includes()
            .AsNoTracking()
            .ApplyFilters(param);

        return await query
            .ProjectTo<ProductSummaryDto>(mapper.ConfigurationProvider)
            .ToListAsync();
    }

    public async Task<List<OptionDto>> GetOptionsAsync(ProductParams param)
    {
        var query = context.Products
            .Includes()
            .ApplyOptionsFilter(param);

        return await query
            .AsNoTracking()
            .ProjectTo<OptionDto>(mapper.ConfigurationProvider)
            .ToListAsync();
    }

    public async Task<PagedList<ProductDto>> GetPagedListAsync(ProductParams param, ClaimsPrincipal user)
    {
        var query = context.Products
            .Includes()
            .ApplySectionFilter(param, user)
            .ApplyFilters(param)
            .ApplySorting(param);

        return await PagedList<ProductDto>.CreateAsync(
            query.AsNoTracking().ProjectTo<ProductDto>(mapper.ConfigurationProvider),
            param.PageNumber,
            param.PageSize);
    }

    public async Task<bool> ExistsByIdAsync(int id) => await context.Products.AnyAsync(x => x.Id == id);

    public async Task<bool> DoctorHasProductOrIsGlobalAsync(int doctorId, int productId) =>
        await context.Products
            .Include(x => x.DoctorProduct.Product)
            .AnyAsync(x => x.Id == productId && (x.DoctorProduct.DoctorId == doctorId || x.DoctorProduct == null));

    public async Task<bool> IsGlobalAsync(int productId) =>
        await context.Products
            .Include(x => x.DoctorProduct)
            .AnyAsync(x => x.Id == productId && x.DoctorProduct == null);

    public async Task<bool> DoctorHasProductAsync(int doctorId, int productId) =>
        await context.Products
            .Include(x => x.DoctorProduct)
            .AnyAsync(x => x.Id == productId && x.DoctorProduct.DoctorId == doctorId);
}
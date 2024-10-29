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

namespace MainService.Infrastructure.Data;

public class ProductRepository(DataContext context, IMapper mapper) : IProductRepository
{
    public void Add(Product item) => context.Products.Add(item);
    public void Delete(Product item) => context.Products.Remove(item);

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

    public async Task<Product> GetByIdAsNoTrackingAsync(int id)
    {
        var item = await context.Products
            .AsNoTracking()
            .SingleOrDefaultAsync(x => x.Id == id);

        return item;
    }

    public async Task<Product> GetByIdAsync(int id)
    {
        var item = await context.Products
            .Include(x => x.DoctorProduct)
            .Include(x => x.ProductPhotos).ThenInclude(x => x.Photo)
            .SingleOrDefaultAsync(x => x.Id == id);

        return item;
    }

    public async Task<Product> GetByNameAsync(string name, ClaimsPrincipal user)
        => await context.Products
            .Include(x => x.DoctorProduct)
            .Include(x => x.ProductPhotos).ThenInclude(x => x.Photo)
            .Where(x => x.DoctorProduct.DoctorId == user.GetUserId())
            .SingleOrDefaultAsync(x => x.Name == name);

    public async Task<bool> ExistsAsync(int id, ClaimsPrincipal user)
    {
        return await context.Products
            .Include(x => x.DoctorProduct)
            .Include(x => x.ProductPhotos).ThenInclude(x => x.Photo)
            .AnyAsync(x => x.Id == id && x.DoctorProduct.DoctorId == user.GetUserId());
    }

    public async Task<ProductDto> GetDtoByIdAsync(int id)
    {
        var item = await context.Products
            .Include(x => x.ProductPhotos).ThenInclude(x => x.Photo)
            .AsNoTracking()
            .ProjectTo<ProductDto>(mapper.ConfigurationProvider)
            .SingleOrDefaultAsync(x => x.Id == id);

        return item;
    }

    public async Task<List<ProductSummaryDto>> GetSummaryDtosAsync(ProductParams param, ClaimsPrincipal user)
    {
        var query = context.Products
            .Include(x => x.DoctorProduct)
            .Include(x => x.ProductPhotos).ThenInclude(x => x.Photo)
            .AsNoTracking()
            .ProjectTo<ProductSummaryDto>(mapper.ConfigurationProvider);

        if (!string.IsNullOrEmpty(param.Search))
        {
            string searchParam = param.Search.Replace(" ", "").ToLower();

            query = query.Where(x =>
                EF.Functions.Like(x.Name.Replace(" ", "").ToLower(), $"%{searchParam}%") ||
                EF.Functions.Like(x.Description.Replace(" ", "").ToLower(), $"%{searchParam}%"));
        }

        return await query.ToListAsync();
    }

    public async Task<List<OptionDto>> GetOptionsAsync(ProductParams param)
    {
        IQueryable<Product> query = Includes(context.Products).AsQueryable();

        query = query.Where(x => x.DoctorProduct.DoctorId == param.DoctorId || x.DoctorProduct == null);

        return await query
            .AsNoTracking()
            .ProjectTo<OptionDto>(mapper.ConfigurationProvider)
            .ToListAsync();
    }

    private static IQueryable<Product> Includes(IQueryable<Product> query) =>
        query
            .AsSplitQuery()
            .Include(x => x.DoctorProduct)
            .Include(x => x.ProductPhotos).ThenInclude(x => x.Photo)
        ;

    public async Task<PagedList<ProductDto>> GetPagedListAsync(ProductParams param, ClaimsPrincipal user)
    {
        var query = context.Products
            .Include(x => x.DoctorProduct)
            .Include(x => x.ProductPhotos).ThenInclude(x => x.Photo)
            .AsQueryable();

        query = query.Where(x => x.DoctorProduct.DoctorId == user.GetUserId() || x.DoctorProduct == null);

        if (param.DateFrom != DateTime.MinValue)
            query = query.Where(x => x.CreatedAt >= param.DateFrom);

        if (param.DateTo != DateTime.MaxValue)
            query = query.Where(x => x.CreatedAt <= param.DateTo);

        if (!string.IsNullOrEmpty(param.Search))
        {
            string term = param.Search.ToLower();

            query = query.Where(x =>
                EF.Functions.Like(x.Name, $"%{term}%") ||
                EF.Functions.Like(x.Description, $"%{term}%")
            );
        }

        if (!string.IsNullOrEmpty(param.Sort))
        {
            switch (param.Sort)
            {
                case "id":
                    query = param.IsSortAscending
                        ? query.OrderBy(x => x.Id)
                        : query.OrderByDescending(x => x.Id);
                    break;
                case "name":
                    query = param.IsSortAscending
                        ? query.OrderBy(x => x.Name)
                        : query.OrderByDescending(x => x.Name);
                    break;
                case "price":
                    query = param.IsSortAscending
                        ? query.OrderBy(x => x.Price)
                        : query.OrderByDescending(x => x.Price);
                    break;
                case "discount":
                    query = param.IsSortAscending
                        ? query.OrderBy(x => x.Discount)
                        : query.OrderByDescending(x => x.Discount);
                    break;
                default:
                    query = query.OrderByDescending(x => x.CreatedAt);
                    break;
            }
        }

        return await PagedList<ProductDto>.CreateAsync(
            query.AsNoTracking().ProjectTo<ProductDto>(mapper.ConfigurationProvider), param.PageNumber, param.PageSize);
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
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
using MainService.Models.Helpers.Enums;

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
            .AsNoTracking()
            .SingleOrDefaultAsync(x => x.Id == id);

    public async Task<Product?> GetByIdAsync(int id) =>
        await context.Products
            .Include(x => x.DoctorProduct)
            .Include(x => x.ProductPhotos).ThenInclude(x => x.Photo)
            .Include(x => x.WarehouseProducts)
            .SingleOrDefaultAsync(x => x.Id == id);

    public async Task<Product?> GetByNameAsync(string name, ClaimsPrincipal user) => await context.Products
        .Include(x => x.DoctorProduct)
        .Include(x => x.ProductPhotos).ThenInclude(x => x.Photo)
        .Include(x => x.WarehouseProducts)
        .Where(x => x.DoctorProduct.DoctorId == user.GetUserId())
        .SingleOrDefaultAsync(x => x.Name == name);

    public async Task<bool> ExistsAsync(int id, ClaimsPrincipal user)
    {
        return await context.Products
            .Include(x => x.DoctorProduct)
            .Include(x => x.ProductPhotos).ThenInclude(x => x.Photo)
            .Include(x => x.WarehouseProducts)
            .AnyAsync(x => x.Id == id && x.DoctorProduct.DoctorId == user.GetUserId());
    }

    public async Task<ProductDto?> GetDtoByIdAsync(int id)
    {
        var item = await context.Products
            .Include(x => x.ProductPhotos).ThenInclude(x => x.Photo)
            .Include(x => x.WarehouseProducts)
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
                .Include(x => x.WarehouseProducts)
                .AsNoTracking()
            ;

        if (!string.IsNullOrEmpty(param.Search))
        {
            var term = param.Search.ToLower();

            query = query.Where(
                x =>
                    !string.IsNullOrEmpty(x.Name) && x.Name.ToLower().Contains(term) ||
                    !string.IsNullOrEmpty(x.Description) && x.Description.ToLower().Contains(term) ||
                    !string.IsNullOrEmpty(x.Unit) && x.Unit.ToLower().Contains(term) ||
                    !string.IsNullOrEmpty(x.Manufacturer) && x.Manufacturer.ToLower().Contains(term) ||
                    !string.IsNullOrEmpty(x.LotNumber) && x.LotNumber.ToLower().Contains(term) ||
                    x.Price.HasValue && x.Price.Value.ToString().ToLower().Contains(term) ||
                    x.Discount.HasValue && x.Discount.Value.ToString().ToLower().Contains(term) ||
                    x.Dosage.HasValue && x.Dosage.Value.ToString().ToLower().Contains(term)
            );
        }

        return await query
                .ProjectTo<ProductSummaryDto>(mapper.ConfigurationProvider)
                .ToListAsync()
            ;
    }

    public async Task<List<OptionDto>> GetOptionsAsync(ProductParams param)
    {
        var query = Includes(context.Products).AsQueryable();

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
            .Include(x => x.WarehouseProducts);

    public async Task<PagedList<ProductDto>> GetPagedListAsync(ProductParams param, ClaimsPrincipal user)
    {
        var userId = user.GetUserId();
        var userRoles = user.GetRoles();

        var query = context.Products
            .Include(x => x.DoctorProduct)
            .Include(x => x.ProductPhotos).ThenInclude(x => x.Photo)
            .Include(x => x.WarehouseProducts)
            .AsQueryable();

        // Section filtering
        if (!string.IsNullOrEmpty(param.FromSection))
        {
            switch (param.FromSection)
            {
                case SiteSection.Admin when !userRoles.Contains(Roles.Admin.ToString()):
                    throw new UnauthorizedAccessException("Access denied. Admin role required.");
                case SiteSection.Admin:
                    query = query.Where(x => x.DoctorProduct == null);
                    break;
                case SiteSection.Home:
                    query = query.Where(x => x.DoctorProduct.DoctorId == userId);
                    break;
                default:
                {
                    query = query.Where(x => x.IsVisible);
                    if (param.DoctorId.HasValue)
                        query = query.Where(x => x.DoctorProduct.DoctorId == userId || x.DoctorProduct == null);
                    break;
                }
            }
        }
        else
        {
            query = query.Where(x => x.IsVisible);
            if (param.DoctorId.HasValue)
                query = query.Where(x => x.DoctorProduct.DoctorId == userId || x.DoctorProduct == null);
        }

        // Apply explicit filters regardless of the search term

        // IsInternal filter: if provided, check its value.
        if (param.IsInternal.HasValue)
        {
            // Assuming true means "internal only" (DoctorProduct == null),
            // and false means "non-internal" (DoctorProduct != null)
            query = param.IsInternal.Value
                ? query.Where(x => x.DoctorProduct == null)
                : query.Where(x => x.DoctorProduct != null);
        }

        if (!string.IsNullOrEmpty(param.Barcode))
        {
            var barcodeTerm = param.Barcode.ToLower();
            query = query.Where(x => x.Barcode != null && x.Barcode.ToLower().Contains(barcodeTerm));
        }

        if (!string.IsNullOrEmpty(param.Sku))
        {
            var skuTerm = param.Sku.ToLower();
            query = query.Where(x => x.SKU != null && x.SKU.ToLower().Contains(skuTerm));
        }

        if (param.Price.HasValue)
        {
            query = query.Where(x => x.Price == param.Price);
        }

        if (!string.IsNullOrEmpty(param.LotNumber))
        {
            var lotNumberTerm = param.LotNumber.ToLower();
            query = query.Where(x => x.LotNumber != null && x.LotNumber.ToLower().Contains(lotNumberTerm));
        }

        // Now, apply the search term as an additional filter (ANDed with the above)
        if (!string.IsNullOrEmpty(param.Search))
        {
            var term = param.Search.ToLower();
            query = query.Where(x =>
                (!string.IsNullOrEmpty(x.Name) && x.Name.ToLower().Contains(term)) ||
                (!string.IsNullOrEmpty(x.Description) && x.Description.ToLower().Contains(term)) ||
                (!string.IsNullOrEmpty(x.Unit) && x.Unit.ToLower().Contains(term)) ||
                (!string.IsNullOrEmpty(x.Manufacturer) && x.Manufacturer.ToLower().Contains(term)) ||
                (!string.IsNullOrEmpty(x.LotNumber) && x.LotNumber.ToLower().Contains(term)) ||
                (x.Price.HasValue && x.Price.Value.ToString().ToLower().Contains(term)) ||
                (x.Discount.HasValue && x.Discount.Value.ToString().ToLower().Contains(term)) ||
                (x.Dosage.HasValue && x.Dosage.Value.ToString().ToLower().Contains(term)) ||
                (!string.IsNullOrEmpty(x.SKU) && x.SKU.ToLower().Contains(term)) ||
                (x.Barcode != null && x.Barcode.ToLower().Contains(term))
            );
        }

        // Sorting logic
        if (!string.IsNullOrEmpty(param.Sort))
        {
            query = param.Sort.ToLower() switch
            {
                "id" => param.IsSortAscending.HasValue && param.IsSortAscending.Value
                    ? query.OrderBy(x => x.Id)
                    : query.OrderByDescending(x => x.Id),
                "name" => param.IsSortAscending.HasValue && param.IsSortAscending.Value
                    ? query.OrderBy(x => x.Name)
                    : query.OrderByDescending(x => x.Name),
                "description" => param.IsSortAscending.HasValue && param.IsSortAscending.Value
                    ? query.OrderBy(x => x.Description)
                    : query.OrderByDescending(x => x.Description),
                "unit" => param.IsSortAscending.HasValue && param.IsSortAscending.Value
                    ? query.OrderBy(x => x.Unit)
                    : query.OrderByDescending(x => x.Unit),
                "manufacturer" => param.IsSortAscending.HasValue && param.IsSortAscending.Value
                    ? query.OrderBy(x => x.Manufacturer)
                    : query.OrderByDescending(x => x.Manufacturer),
                "lotnumber" => param.IsSortAscending.HasValue && param.IsSortAscending.Value
                    ? query.OrderBy(x => x.LotNumber)
                    : query.OrderByDescending(x => x.LotNumber),
                "price" => param.IsSortAscending.HasValue && param.IsSortAscending.Value
                    ? query.OrderBy(x => x.Price)
                    : query.OrderByDescending(x => x.Price),
                "discount" => param.IsSortAscending.HasValue && param.IsSortAscending.Value
                    ? query.OrderBy(x => x.Discount)
                    : query.OrderByDescending(x => x.Discount),
                "dosage" => param.IsSortAscending.HasValue && param.IsSortAscending.Value
                    ? query.OrderBy(x => x.Dosage)
                    : query.OrderByDescending(x => x.Dosage),
                "createdat" => param.IsSortAscending.HasValue && param.IsSortAscending.Value
                    ? query.OrderBy(x => x.CreatedAt)
                    : query.OrderByDescending(x => x.CreatedAt),
                _ => query.OrderByDescending(x => x.CreatedAt),
            };
        }
        else
        {
            query = query.OrderByDescending(x => x.CreatedAt);
        }

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
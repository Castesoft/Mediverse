using AutoMapper;
using AutoMapper.QueryableExtensions;
using MainService.Core.DTOs.Products;
using MainService.Core.Helpers.Pagination;
using MainService.Core.Helpers.Params;
using MainService.Core.Interfaces.Data;
using MainService.Models;
using MainService.Models.Entities;
using Microsoft.EntityFrameworkCore;

namespace MainService.Infrastructure.Data;
public class ProductRepository(DataContext context, IMapper mapper) : IProductRepository
{
    public void Add(Product item)
    {
        context.Products.Remove(item);
    }

    public void Delete(Product item)
    {
        context.Products.Remove(item);
    }

    public async Task<List<Product>> GetAllAsync()
    {
        return await context.Products.ToListAsync();
    }

    public async Task<List<ProductDto>> GetAllDtoAsync()
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
            .SingleOrDefaultAsync(x => x.Id == id);

        return item;
    }

    public async Task<ProductDto> GetDtoByIdAsync(int id)
    {
        var item = await context.Products
            .AsNoTracking()
            .ProjectTo<ProductDto>(mapper.ConfigurationProvider)
            .SingleOrDefaultAsync(x => x.Id == id);

        return item;
    }

    public async Task<PagedList<ProductDto>> GetPagedListAsync(ProductParams param)
    {
        var query = context.Products
            .AsQueryable();

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
            query.AsNoTracking().ProjectTo<ProductDto>(mapper.ConfigurationProvider),
            param.PageNumber, param.PageSize);
    }
}
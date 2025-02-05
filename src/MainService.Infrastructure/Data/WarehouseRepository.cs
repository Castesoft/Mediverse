using System.Security.Claims;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using MainService.Core.DTOs.Warehouses;
using MainService.Core.Helpers.Pagination;
using MainService.Core.Helpers.Params;
using MainService.Core.Interfaces.Data;
using MainService.Core.Extensions;
using MainService.Models;
using MainService.Models.Entities;
using Microsoft.EntityFrameworkCore;

namespace MainService.Infrastructure.Data;

public class WarehouseRepository(DataContext context, IMapper mapper) : IWarehouseRepository
{
    public void Add(Warehouse item) => context.Warehouses.Remove(item);
    public void Delete(Warehouse item) => context.Warehouses.Remove(item);
    public async Task<List<Warehouse>> GetAllAsync() => await context.Warehouses.ToListAsync();

    public async Task<List<WarehouseDto>> GetAllDtoAsync(WarehouseParams param) =>
        await context.Warehouses
            .AsNoTracking()
            .ProjectTo<WarehouseDto>(mapper.ConfigurationProvider)
            .ToListAsync();


    public async Task<Warehouse?> GetByIdAsNoTrackingAsync(int id) =>
        await context.Warehouses
            .AsNoTracking()
            .SingleOrDefaultAsync(x => x.Id == id);

    public async Task<Warehouse?> GetByIdAsync(int id) =>
        await context.Warehouses
            .SingleOrDefaultAsync(x => x.Id == id);


    public async Task<WarehouseDto?> GetDtoByIdAsync(int id) =>
        await context.Warehouses
            .AsNoTracking()
            .ProjectTo<WarehouseDto>(mapper.ConfigurationProvider)
            .SingleOrDefaultAsync(x => x.Id == id);

    public async Task<PagedList<WarehouseDto>> GetPagedListAsync(WarehouseParams param, ClaimsPrincipal user)
    {
        var query = context.Warehouses
            .AsQueryable();

        IEnumerable<string> roles = user.GetRoles();
        int userId = user.GetUserId();


        if (!string.IsNullOrEmpty(param.Search))
        {
            string term = param.Search.ToLower();

            query = query.Where(
                x =>
                    !string.IsNullOrEmpty(x.Name) && x.Name.ToLower().Contains(term) ||
                    !string.IsNullOrEmpty(x.Description) && x.Description.ToLower().Contains(term)
            );
        }

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
                _ => query.OrderByDescending(x => x.CreatedAt),
            };
        }
        else
        {
            query = query.OrderByDescending(x => x.CreatedAt);
        }

        return await PagedList<WarehouseDto>.CreateAsync(
            query.AsNoTracking().ProjectTo<WarehouseDto>(mapper.ConfigurationProvider),
            param.PageNumber, param.PageSize);
    }

    public async Task<bool> ExistsByIdAsync(int id) => await context.Warehouses.AnyAsync(x => x.Id == id);

    private static IQueryable<Warehouse> Includes(IQueryable<Warehouse> query) =>
        query
            .AsSplitQuery()
            .AsQueryable();
}
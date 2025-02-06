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
using MainService.Infrastructure.QueryExtensions;
using MainService.Models.Entities.Aggregate;

namespace MainService.Infrastructure.Data
{
    public class WarehouseRepository(DataContext context, IMapper mapper) : IWarehouseRepository
    {
        public void Add(Warehouse item) => context.Warehouses.Add(item);
        public void Delete(Warehouse item) => context.Warehouses.Remove(item);
        public async Task<List<Warehouse>> GetAllAsync() => await context.Warehouses.ToListAsync();

        public async Task<List<WarehouseDto>> GetAllDtoAsync(WarehouseParams param) =>
            await context.Warehouses
                .Includes()
                .AsNoTracking()
                .ProjectTo<WarehouseDto>(mapper.ConfigurationProvider)
                .ToListAsync();

        public Task<List<OptionDto>> GetOptionsAsync(WarehouseParams param)
        {
            var query = context.Warehouses.AsQueryable();
            
            return query
                .AsNoTracking()
                .ProjectTo<OptionDto>(mapper.ConfigurationProvider)
                .ToListAsync();
        }

        public async Task<Warehouse?> GetByIdAsNoTrackingAsync(int id) =>
            await context.Warehouses
                .Includes()
                .AsNoTracking()
                .SingleOrDefaultAsync(x => x.Id == id);

        public async Task<Warehouse?> GetByIdAsync(int id) =>
            await context.Warehouses.Includes().SingleOrDefaultAsync(x => x.Id == id);

        public async Task<WarehouseDto?> GetDtoByIdAsync(int id) =>
            await context.Warehouses
                .Includes()
                .AsNoTracking()
                .ProjectTo<WarehouseDto>(mapper.ConfigurationProvider)
                .SingleOrDefaultAsync(x => x.Id == id);

        public async Task<PagedList<WarehouseDto>> GetPagedListAsync(WarehouseParams param, ClaimsPrincipal user)
        {
            var query = context.Warehouses.Includes().AsQueryable();

            var roles = user.GetRoles();
            var userId = user.GetUserId();

            query = query.ApplyFilter(param);
            query = query.ApplySorting(param);

            return await PagedList<WarehouseDto>.CreateAsync(
                query.AsNoTracking().ProjectTo<WarehouseDto>(mapper.ConfigurationProvider),
                param.PageNumber, param.PageSize);
        }

        public async Task<bool> ExistsByIdAsync(int id) => await context.Warehouses.AnyAsync(x => x.Id == id);
    }
}
using System.Security.Claims;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using MainService.Core.Extensions;
using MainService.Core.DTOs.Services;
using MainService.Core.Helpers.Pagination;
using MainService.Core.Helpers.Params;
using MainService.Core.Interfaces.Data;
using MainService.Models;
using MainService.Models.Entities;
using Microsoft.EntityFrameworkCore;

namespace MainService.Infrastructure.Data;
public class ServiceRepository(DataContext context, IMapper mapper) : IServiceRepository
{
    public void Add(Service item) => context.Services.Add(item);
    public void Delete(Service item) => context.Services.Remove(item);

    public async Task<List<Service>> GetAllAsync()
    {
        return await context.Services.ToListAsync();
    }

    public async Task<List<ServiceDto>> GetAllDtoAsync(ServiceParams param, ClaimsPrincipal user)
    {
        var query = context.Services
            .AsNoTracking()
            .ProjectTo<ServiceDto>(mapper.ConfigurationProvider);

        return await query.ToListAsync();
    }

    public async Task<Service> GetByIdAsNoTrackingAsync(int id)
    {
        var item = await context.Services
            .AsNoTracking()
            .SingleOrDefaultAsync(x => x.Id == id);

        return item;
    }

    public async Task<Service> GetByIdAsync(int id)
    {
        var item = await context.Services
            .SingleOrDefaultAsync(x => x.Id == id);

        return item;
    }

    public async Task<Service> GetByNameAsync(string name, ClaimsPrincipal user)
        => await context.Services
            .Include(x => x.DoctorService)
            .Where(x => x.DoctorService.DoctorId == user.GetUserId())
            .SingleOrDefaultAsync(x => x.Name == name);

    public async Task<bool> ExistsByIdAndDoctorIdAsync(int id, int doctorId)
    {
        return await context.Services
            .Include(x => x.DoctorService)
            .AnyAsync(x => x.Id == id && x.DoctorService.DoctorId == doctorId);
    }

    public async Task<ServiceDto> GetDtoByIdAsync(int id)
    {
        var item = await context.Services
            .AsNoTracking()
            .ProjectTo<ServiceDto>(mapper.ConfigurationProvider)
            .SingleOrDefaultAsync(x => x.Id == id);

        return item;
    }

    public async Task<PagedList<ServiceDto>> GetPagedListAsync(ServiceParams param, ClaimsPrincipal user)
    {
        var query = context.Services
            .Include(x => x.DoctorService)
            .AsQueryable();

        int userId = user.GetUserId();

        query = query.Where(x => x.DoctorService.DoctorId == userId);

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

        return await PagedList<ServiceDto>.CreateAsync(
            query.AsNoTracking().ProjectTo<ServiceDto>(mapper.ConfigurationProvider),
            param.PageNumber, param.PageSize);
    }

    public async Task<bool> ExistsByIdAsync(int id) => await context.Services.AnyAsync(x => x.Id == id);
}
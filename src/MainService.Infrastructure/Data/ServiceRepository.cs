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
using MainService.Models.Entities.Aggregate;

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

    public async Task<Service?> GetByIdAsNoTrackingAsync(int id) =>
        await context.Services
            .AsNoTracking()
            .SingleOrDefaultAsync(x => x.Id == id)
        ;

    public async Task<Service?> GetByIdAsync(int id) =>
        await context.Services
            .SingleOrDefaultAsync(x => x.Id == id)
        ;

    public async Task<Service?> GetByNameAsync(string name, ClaimsPrincipal user) => 
        await context.Services
            .Include(x => x.DoctorService)
            .Where(x => x.DoctorService.DoctorId == user.GetUserId())
            .SingleOrDefaultAsync(x => x.Name == name)
        ;

    public async Task<bool> ExistsByIdAndDoctorIdAsync(int id, int doctorId)
    {
        return await context.Services
            .Include(x => x.DoctorService)
            .AnyAsync(x => x.Id == id && x.DoctorService.DoctorId == doctorId);
    }

    public async Task<ServiceDto?> GetDtoByIdAsync(int id) =>
        await context.Services
            .AsNoTracking()
            .ProjectTo<ServiceDto>(mapper.ConfigurationProvider)
            .SingleOrDefaultAsync(x => x.Id == id)
        ;

    public async Task<PagedList<ServiceDto>> GetPagedListAsync(ServiceParams param, ClaimsPrincipal user)
    {
        IQueryable<Service> query = context.Services
            .Include(x => x.DoctorService)
            .AsQueryable()
        ;

        int userId = user.GetUserId();

        query = query.Where(x => x.DoctorService.DoctorId == userId);

        if (!string.IsNullOrEmpty(param.Search))
        {
            string term = param.Search.ToLower();
            
            query = query.Where(
                x =>
                    !string.IsNullOrEmpty(x.Name) && x.Name.ToLower().Contains(term) ||
                    !string.IsNullOrEmpty(x.Description) && x.Description.ToLower().Contains(term) ||
                    x.Price.HasValue && x.Price.Value.ToString().ToLower().Contains(term) ||
                    x.Discount.HasValue && x.Discount.Value.ToString().ToLower().Contains(term)
            );
        }

        if (!string.IsNullOrEmpty(param.Sort))
        {
            query = param.Sort.ToLower() switch
            {
                "id" => param.IsSortAscending.HasValue && param.IsSortAscending.Value ? query.OrderBy(x => x.Id) : query.OrderByDescending(x => x.Id),
                "name" => param.IsSortAscending.HasValue && param.IsSortAscending.Value ? query.OrderBy(x => x.Name) : query.OrderByDescending(x => x.Name),
                "description" => param.IsSortAscending.HasValue && param.IsSortAscending.Value ? query.OrderBy(x => x.Description) : query.OrderByDescending(x => x.Description),
                "price" => param.IsSortAscending.HasValue && param.IsSortAscending.Value ? query.OrderBy(x => x.Price) : query.OrderByDescending(x => x.Price),
                "discount" => param.IsSortAscending.HasValue && param.IsSortAscending.Value ? query.OrderBy(x => x.Discount) : query.OrderByDescending(x => x.Discount),
                "createdat" => param.IsSortAscending.HasValue && param.IsSortAscending.Value ? query.OrderBy(x => x.CreatedAt) : query.OrderByDescending(x => x.CreatedAt),
                _ => query.OrderByDescending(x => x.CreatedAt),
            };
        } else {
            query = query.OrderByDescending(x => x.CreatedAt);
        }

        return await PagedList<ServiceDto>.CreateAsync(
            query.AsNoTracking().ProjectTo<ServiceDto>(mapper.ConfigurationProvider),
            param.PageNumber, param.PageSize);
    }

    public async Task<bool> ExistsByIdAsync(int id) => await context.Services.AnyAsync(x => x.Id == id);

    public async Task<List<OptionDto>> GetOptionsAsync(ServiceParams param)
    {
        IQueryable<Service> query = context.Services
            .Include(x => x.DoctorService)
            .AsQueryable()
        ;

        if (param.DoctorId.HasValue) {
            query = query.Where(x => x.DoctorService.DoctorId == param.DoctorId.Value);
        }

        return await query
            .AsNoTracking()
            .ProjectTo<OptionDto>(mapper.ConfigurationProvider)
            .ToListAsync();
    }
}
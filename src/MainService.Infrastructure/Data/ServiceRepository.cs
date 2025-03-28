using System.Security.Claims;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using MainService.Core.Extensions;
using MainService.Core.DTOs.Services;
using MainService.Core.Helpers.Pagination;
using MainService.Core.Helpers.Params;
using MainService.Core.Interfaces.Data;
using MainService.Infrastructure.QueryExtensions;
using MainService.Models;
using MainService.Models.Entities;
using MainService.Models.Entities.Aggregate;
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
        return await context.Services
            .AsNoTracking()
            .ProjectTo<ServiceDto>(mapper.ConfigurationProvider)
            .ToListAsync();
    }

    public async Task<Service?> GetByIdAsNoTrackingAsync(int id)
    {
        return await context.Services
                .ApplyIncludes()
                .AsNoTracking()
                .SingleOrDefaultAsync(x => x.Id == id);
    }


    public async Task<Service?> GetByIdAsync(int id)
    {
        return await context.Services
            .ApplyIncludes()
            .SingleOrDefaultAsync(x => x.Id == id);
    }

    public async Task<Service?> GetByNameAsync(string name, ClaimsPrincipal user)
    {
        return await context.Services
            .ApplyIncludes()
            .Where(x => x.DoctorService.DoctorId == user.GetUserId())
            .SingleOrDefaultAsync(x => x.Name == name);
    }

    public async Task<bool> ExistsByIdAndDoctorIdAsync(int id, int doctorId)
    {
        return await context.Services
            .ApplyIncludes()
            .AnyAsync(x => x.Id == id && x.DoctorService.DoctorId == doctorId);
    }

    public async Task<ServiceDto?> GetDtoByIdAsync(int id)
    {
        return await context.Services
            .ApplyIncludes()
            .AsNoTracking()
            .ProjectTo<ServiceDto>(mapper.ConfigurationProvider)
            .SingleOrDefaultAsync(x => x.Id == id);
    }

    public async Task<PagedList<ServiceDto>> GetPagedListAsync(ServiceParams param, ClaimsPrincipal user)
    {
        var query = context.Services.AsQueryable();

        // Apply the query extensions
        query = query.ApplyIncludes();
        query = query.ApplyAccessControl(param, user);
        query = query.ApplyFiltering(param);
        query = query.ApplySorting(param);

        return await PagedList<ServiceDto>.CreateAsync(
            query.AsNoTracking().ProjectTo<ServiceDto>(mapper.ConfigurationProvider),
            param.PageNumber, param.PageSize);
    }

    public async Task<bool> ExistsByIdAsync(int id)
    {
        return await context.Services.AnyAsync(x => x.Id == id);
    }

    public async Task<List<OptionDto>> GetOptionsAsync(ServiceParams param)
    {
        var query = context.Services
            .ApplyIncludes()
            .ApplyOptionsFilter(param);

        return await query
            .AsNoTracking()
            .ProjectTo<OptionDto>(mapper.ConfigurationProvider)
            .ToListAsync();
    }
}
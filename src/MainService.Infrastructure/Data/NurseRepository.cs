using AutoMapper;
using AutoMapper.QueryableExtensions;
using MainService.Core.DTOs.Nurses;
using MainService.Core.Helpers.Pagination;
using MainService.Core.Helpers.Params;
using MainService.Core.Interfaces.Data;
using MainService.Infrastructure.QueryExtensions;
using MainService.Models;
using MainService.Models.Entities;
using MainService.Models.Entities.Aggregate;
using Microsoft.EntityFrameworkCore;

namespace MainService.Infrastructure.Data;

public class NurseRepository(DataContext context, IMapper mapper) : INurseRepository
{
    public async Task<bool> ExistsAsync(int id, int doctorId)
    {
        return await context.Users
            .Include(x => x.Doctors)
            .AnyAsync(x => x.Id == id && x.Doctors.Any(x => x.DoctorId == doctorId));
    }

    public async Task<List<NurseDto>> GetAllDtoAsync(NurseParams param)
    {
        return await context.Users
            .AsNoTracking()
            .ProjectTo<NurseDto>(mapper.ConfigurationProvider).ToListAsync();
    }

    public async Task<NurseDto?> GetDtoByIdAsync(int id)
    {
        return await context.Users
            .AsNoTracking()
            .ProjectTo<NurseDto>(mapper.ConfigurationProvider)
            .SingleOrDefaultAsync(x => x.Id == id);
    }

    public async Task<PagedList<NurseDto>> GetPagedListAsync(NurseParams param)
    {
        var query = context.Users.AsQueryable();

        query = query.ApplyIncludes();
        query = query.ApplyNurseFiltering(param);
        query = query.ApplyNurseSorting(param);

        return await PagedList<NurseDto>.CreateAsync(
            query.AsNoTracking().ProjectTo<NurseDto>(mapper.ConfigurationProvider),
            param.PageNumber,
            param.PageSize
        );
    }

    public async Task<List<OptionDto>> GetOptionsAsync(NurseParams param)
    {
        var query = context.Users.AsQueryable();

        query = query.ApplyNurseRoleFiltering();
        query = query.ApplyNurseFiltering(param);

        return await query
            .AsNoTracking()
            .ProjectTo<OptionDto>(mapper.ConfigurationProvider)
            .ToListAsync();
    }
}
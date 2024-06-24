using AutoMapper;
using AutoMapper.QueryableExtensions;
using MainService.Core.DTOs.Patients;
using MainService.Core.Helpers.Pagination;
using MainService.Core.Helpers.Params;
using MainService.Core.Interfaces.Data;
using MainService.Models;
using MainService.Models.Entities;
using Microsoft.EntityFrameworkCore;

namespace MainService.Infrastructure.Data;

public class UserRepository(DataContext context, IMapper mapper) : IUserRepository
{
    public void Add(AppUser item)
    {
        context.Users.Remove(item);
    }

    public void Delete(AppUser item)
    {
        context.Users.Remove(item);
    }

    public async Task<List<AppUser>> GetAllAsync()
    {
        return await context.Users.ToListAsync();
    }

    public async Task<List<PatientDto>> GetAllDtoAsync()
    {
        var query = context.Users
            .AsNoTracking()
            .ProjectTo<PatientDto>(mapper.ConfigurationProvider);

        return await query.ToListAsync();
    }

    public async Task<AppUser> GetByIdAsNoTrackingAsync(int id)
    {
        var item = await context.Users
            .AsNoTracking()
            .SingleOrDefaultAsync(x => x.Id == id);

        return item;
    }

    public async Task<AppUser> GetByIdAsync(int id)
    {
        var item = await context.Users
            .SingleOrDefaultAsync(x => x.Id == id);

        return item;
    }

    public async Task<PatientDto> GetDtoByIdAsync(int id)
    {
        var item = await context.Users
            .AsNoTracking()
            .ProjectTo<PatientDto>(mapper.ConfigurationProvider)
            .SingleOrDefaultAsync(x => x.Id == id);

        return item;
    }

    public async Task<PagedList<PatientDto>> GetPagedListAsync(UserParams param)
    {
        var query = context.Users
            .Include(x => x.UserRoles).ThenInclude(x => x.Role)
            .AsQueryable();

        query = query.Where(x => x.UserRoles.Any(y => y.Role.Name == "Patient"));

        return await PagedList<PatientDto>.CreateAsync(
            query.AsNoTracking().ProjectTo<PatientDto>(mapper.ConfigurationProvider),
            param.PageNumber, param.PageSize);
    }
}
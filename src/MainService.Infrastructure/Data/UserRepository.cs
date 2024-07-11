using System.Security.Claims;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using MainService.Core.DTOs;
using MainService.Core.DTOs.User;
using MainService.Core.Extensions;
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

    public async Task<PrescriptionInformationDto> GetPrescriptionInformationAsync(int doctorId)
    {
        var doctor = await context.Users
            .Where(x => x.Id == doctorId)
            .Include(x => x.DoctorClinics).ThenInclude(x => x.Clinic)
            .SingleOrDefaultAsync();

        var clinic = doctor.DoctorClinics.FirstOrDefault()?.Clinic;
        
        if (clinic == null) return null;

        var newVar = await context.Locations
            .Include(x => x.LocationPhones).ThenInclude(x => x.Phone)
            .SingleOrDefaultAsync(x => x.Id == clinic.Id);

        return mapper.Map<PrescriptionInformationDto>(newVar);
    }

    public async Task<List<AppUser>> GetAllAsync()
    {
        return await context.Users.ToListAsync();
    }

    public async Task<List<UserDto>> GetAllDtoAsync(UserParams param)
    {
        // TODO: Implement filtering
        
        var query = context.Users
            .AsNoTracking()
            .ProjectTo<UserDto>(mapper.ConfigurationProvider);

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

    public async Task<UserDto> GetDtoByIdAsync(int id)
    {
        var item = await context.Users
            .AsNoTracking()
            .ProjectTo<UserDto>(mapper.ConfigurationProvider)
            .SingleOrDefaultAsync(x => x.Id == id);

        return item;
    }

    public async Task<PagedList<UserDto>> GetPagedListAsync(UserParams param, ClaimsPrincipal user)
    {
        var query = context.Users
            .Include(x => x.Patients)
            .Include(x => x.Doctors)
            .Include(x => x.UserRoles).ThenInclude(x => x.Role)
            .AsQueryable();

        IEnumerable<string> roles = user.GetRoles();
        int userId = user.GetUserId();

        query = query.Where(x => x.Id != userId);

        if (roles.Contains("Admin"))
        {
            // for users where the role is 'Doctor'
            if (roles.Contains("Doctor"))
            {
                query = query.Where(x => x.UserRoles.Any(x => x.Role.Name == "Doctor"));
            }
        }

        if (roles.Contains("Doctor"))
        {
            int doctorId = userId;
            
            query = query.Where(x => x.UserRoles.Any(x => x.Role.Name == "Patient"));
            query = query.Where(x => x.Doctors.Any(x => x.DoctorId == doctorId));
        }

        if(!string.IsNullOrEmpty(param.Search)) 
        {
            query = query.Where(x => 
            EF.Functions.Like(x.FirstName.ToLower(), $"%{param.Search}%") || 
            EF.Functions.Like(x.LastName.ToLower(), $"%{param.Search}%") ||
            EF.Functions.Like(x.Email.ToLower(), $"%{param.Search}%") ||
            EF.Functions.Like(x.Sex.ToLower(), $"%{param.Search}%") ||
            EF.Functions.Like(x.PhoneNumber.ToLower(), $"%{param.Search}%"));
        }

        return await PagedList<UserDto>.CreateAsync(
            query.AsNoTracking().ProjectTo<UserDto>(mapper.ConfigurationProvider),
            param.PageNumber, param.PageSize);
    }
}
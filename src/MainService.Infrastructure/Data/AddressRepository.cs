using System.Security.Claims;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using MainService.Core.DTOs.Addresses;
using MainService.Core.Helpers.Pagination;
using MainService.Core.Helpers.Params;
using MainService.Core.Interfaces.Data;
using MainService.Core.Extensions;
using MainService.Models;
using MainService.Models.Entities;
using Microsoft.EntityFrameworkCore;

namespace MainService.Infrastructure.Data;

public class AddressRepository(DataContext context, IMapper mapper) : IAddressRepository
{
    public void Add(Address item) => context.Addresses.Remove(item);
    public void Delete(Address item) => context.Addresses.Remove(item);
    public async Task<List<Address>> GetAllAsync() => await context.Addresses.ToListAsync();

    public async Task<List<AddressDto>> GetAllDtoAsync(AddressParams param)
    {
        // TODO: Implement filtering

        var query = context.Addresses
            .AsNoTracking()
            .ProjectTo<AddressDto>(mapper.ConfigurationProvider);

        return await query.ToListAsync();
    }

    public async Task<Address> GetByIdAsNoTrackingAsync(int id)
        => await context.Addresses
            .AsNoTracking()
            .SingleOrDefaultAsync(x => x.Id == id);

    public async Task<Address> GetByIdAsync(int id)
        => await context.Addresses
            .SingleOrDefaultAsync(x => x.Id == id);

    public async Task<bool> ClinicExistsAsync(int id, ClaimsPrincipal user)
    {
        return await context.Addresses
            .Include(x => x.DoctorClinic)
            .AnyAsync(x => x.Id == id && x.DoctorClinic.DoctorId == user.GetUserId());
    }

    public async Task<AddressDto> GetDtoByIdAsync(int id)
        => await context.Addresses
            .AsNoTracking()
            .ProjectTo<AddressDto>(mapper.ConfigurationProvider)
            .SingleOrDefaultAsync(x => x.Id == id);

    public async Task<PagedList<AddressDto>> GetPagedListAsync(AddressParams param, ClaimsPrincipal user)
    {
        var query = context.Addresses
            .Include(x => x.DoctorClinic)
            .AsQueryable();

        IEnumerable<string> roles = user.GetRoles();
        int userId = user.GetUserId();

        switch (param.Type)
        {
            case Addresses.Account:
                query = query.Where(x => x.UserAddress.UserId == userId);
                break;
            case Addresses.Clinic:
                if (!roles.Contains("Doctor") && !roles.Contains("Nurse")) return null;
                int doctorId = userId;

                query = query.Where(x => x.DoctorClinic.DoctorId == doctorId);
                break;
            default:
                break;
        }

        if (!string.IsNullOrEmpty(param.Search))
        {
            query = query.Where(x =>
                EF.Functions.Like(x.Name.ToLower(), $"%{param.Search}%") ||
                EF.Functions.Like(x.Description.ToLower(), $"%{param.Search}%") ||
                EF.Functions.Like(x.Zipcode.ToString(), $"%{param.Search}%") ||
                EF.Functions.Like(x.City.ToLower(), $"%{param.Search}%") ||
                EF.Functions.Like(x.Neighborhood.ToLower(), $"%{param.Search}%") ||
                EF.Functions.Like(x.InteriorNumber.ToLower(), $"%{param.Search}%") ||
                EF.Functions.Like(x.ExteriorNumber.ToLower(), $"%{param.Search}%") ||
                EF.Functions.Like(x.Street.ToLower(), $"%{param.Search}%") ||
                EF.Functions.Like(x.State.ToLower(), $"%{param.Search}%"));
        }

        if (!string.IsNullOrEmpty(param.Sort))
        {
            var lowerSort = param.Sort.ToLower().Trim();

            switch (lowerSort)
            {
                case "name":
                    query = param.IsSortAscending
                        ? query.OrderBy(x => x.Name)
                        : query.OrderByDescending(x => x.Name);
                    break;
                case "description":
                    query = param.IsSortAscending
                        ? query.OrderBy(x => x.Description)
                        : query.OrderByDescending(x => x.Description);
                    break;
                case "zipcode":
                    query = param.IsSortAscending
                        ? query.OrderBy(x => x.Zipcode)
                        : query.OrderByDescending(x => x.Zipcode);
                    break;
                case "city":
                    query = param.IsSortAscending
                        ? query.OrderBy(x => x.City)
                        : query.OrderByDescending(x => x.City);
                    break;
                case "neighborhood":
                    query = param.IsSortAscending
                        ? query.OrderBy(x => x.Neighborhood)
                        : query.OrderByDescending(x => x.Neighborhood);
                    break;
                case "interiorNumber":
                    query = param.IsSortAscending
                        ? query.OrderBy(x => x.InteriorNumber)
                        : query.OrderByDescending(x => x.InteriorNumber);
                    break;
                case "exteriorNumber":
                    query = param.IsSortAscending
                        ? query.OrderBy(x => x.ExteriorNumber)
                        : query.OrderByDescending(x => x.ExteriorNumber);
                    break;
                case "street":
                    query = param.IsSortAscending
                        ? query.OrderBy(x => x.Street)
                        : query.OrderByDescending(x => x.Street);
                    break;
                case "state":
                    query = param.IsSortAscending
                        ? query.OrderBy(x => x.State)
                        : query.OrderByDescending(x => x.State);
                    break;
                default:
                    query = query.OrderByDescending(x => x.DoctorClinic.IsMain);
                    break;
            }
        }

        return await PagedList<AddressDto>.CreateAsync(
            query.AsNoTracking().ProjectTo<AddressDto>(mapper.ConfigurationProvider),
            param.PageNumber, param.PageSize);
    }
}
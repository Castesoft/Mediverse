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
using MainService.Models.Entities.Aggregate;
using MainService.Models.Entities.Addresses;

namespace MainService.Infrastructure.Data;

public class AddressRepository(DataContext context, IMapper mapper) : IAddressRepository
{
    public void Add(Address item) => context.Addresses.Remove(item);
    public void Delete(Address item) => context.Addresses.Remove(item);

    public async Task<List<AddressDto>> GetDtosByUserId(int id)
    {
        return await context.Addresses
            .Include(x => x.UserAddress)
            .Where(x => x.UserAddress.UserId == id)
            .ProjectTo<AddressDto>(mapper.ConfigurationProvider)
            .ToListAsync();
    }

    public async Task<List<Address>> GetAllAsync() => await context.Addresses.ToListAsync();

    public async Task<List<AddressDto>> GetAllDtoAsync(AddressParams param) =>
        await context.Addresses
            .AsNoTracking()
            .ProjectTo<AddressDto>(mapper.ConfigurationProvider)
            .ToListAsync();

    public Task<List<OptionDto>> GetOptionsAsync(AddressParams param)
    {
        var query = context.Addresses
            .Include(x => x.DoctorClinic)
            .AsQueryable();

        if (param.DoctorId.HasValue)
        {
            query = query.Where(x => x.DoctorClinic.DoctorId == param.DoctorId);
        }

        return query
            .AsNoTracking()
            .ProjectTo<OptionDto>(mapper.ConfigurationProvider)
            .ToListAsync();
    }

    public async Task<Address?> GetByIdAsNoTrackingAsync(int id) =>
        await context.Addresses
            .AsNoTracking()
            .SingleOrDefaultAsync(x => x.Id == id);

    public async Task<Address?> GetByIdAsync(int id) =>
        await context.Addresses
            .Include(x => x.DoctorClinic)
            .SingleOrDefaultAsync(x => x.Id == id);

    public async Task<bool> ExistsByIdAndDoctorIdAsync(int id, int doctorId) =>
        await context.Addresses
            .Include(x => x.DoctorClinic)
            .AnyAsync(x => x.Id == id && x.DoctorClinic.DoctorId == doctorId);

    public async Task<AddressDto?> GetDtoByIdAsync(int id) =>
        await context.Addresses
            .AsNoTracking()
            .ProjectTo<AddressDto>(mapper.ConfigurationProvider)
            .SingleOrDefaultAsync(x => x.Id == id);

    public async Task<PagedList<AddressDto>> GetPagedListAsync(AddressParams param, ClaimsPrincipal user)
    {
        var query = context.Addresses
            .Include(x => x.DoctorClinic)
            .AsQueryable();

        var roles = user.GetRoles();
        var userId = user.GetUserId();

        switch (param.Type)
        {
            case AddressesEnum.Account:
                query = query.Where(x => x.UserAddress.UserId == userId);
                break;
            case AddressesEnum.Clinic:
                // if (!roles.Contains("Doctor") && !roles.Contains("Nurse")) return null;
                var doctorId = userId;

                query = query.Where(x => x.DoctorClinic.DoctorId == doctorId);
                break;
            default:
                break;
        }

        if (!string.IsNullOrEmpty(param.Search))
        {
            var term = param.Search.ToLower();

            query = query.Where(
                x =>
                    !string.IsNullOrEmpty(x.Name) && x.Name.ToLower().Contains(term) ||
                    !string.IsNullOrEmpty(x.Description) && x.Description.ToLower().Contains(term) ||
                    !string.IsNullOrEmpty(x.Street) && x.Street.ToLower().Contains(term) ||
                    !string.IsNullOrEmpty(x.InteriorNumber) && x.InteriorNumber.ToLower().Contains(term) ||
                    !string.IsNullOrEmpty(x.ExteriorNumber) && x.ExteriorNumber.ToLower().Contains(term) ||
                    !string.IsNullOrEmpty(x.Neighborhood) && x.Neighborhood.ToLower().Contains(term) ||
                    !string.IsNullOrEmpty(x.City) && x.City.ToLower().Contains(term) ||
                    !string.IsNullOrEmpty(x.State) && x.State.ToLower().Contains(term) ||
                    !string.IsNullOrEmpty(x.Country) && x.Country.ToLower().Contains(term) ||
                    !string.IsNullOrEmpty(x.Zipcode) && x.Zipcode.ToLower().Contains(term) ||
                    !string.IsNullOrEmpty(x.Notes) && x.Notes.ToLower().Contains(term) ||
                    !string.IsNullOrEmpty(x.CrossStreet1) && x.CrossStreet1.ToLower().Contains(term) ||
                    !string.IsNullOrEmpty(x.CrossStreet2) && x.CrossStreet2.ToLower().Contains(term)
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
                "street" => param.IsSortAscending.HasValue && param.IsSortAscending.Value
                    ? query.OrderBy(x => x.Street)
                    : query.OrderByDescending(x => x.Street),
                "interiornumber" => param.IsSortAscending.HasValue && param.IsSortAscending.Value
                    ? query.OrderBy(x => x.InteriorNumber)
                    : query.OrderByDescending(x => x.InteriorNumber),
                "exteriornumber" => param.IsSortAscending.HasValue && param.IsSortAscending.Value
                    ? query.OrderBy(x => x.ExteriorNumber)
                    : query.OrderByDescending(x => x.ExteriorNumber),
                "neighborhood" => param.IsSortAscending.HasValue && param.IsSortAscending.Value
                    ? query.OrderBy(x => x.Neighborhood)
                    : query.OrderByDescending(x => x.Neighborhood),
                "city" => param.IsSortAscending.HasValue && param.IsSortAscending.Value
                    ? query.OrderBy(x => x.City)
                    : query.OrderByDescending(x => x.City),
                "state" => param.IsSortAscending.HasValue && param.IsSortAscending.Value
                    ? query.OrderBy(x => x.State)
                    : query.OrderByDescending(x => x.State),
                "country" => param.IsSortAscending.HasValue && param.IsSortAscending.Value
                    ? query.OrderBy(x => x.Country)
                    : query.OrderByDescending(x => x.Country),
                "zipcode" => param.IsSortAscending.HasValue && param.IsSortAscending.Value
                    ? query.OrderBy(x => x.Zipcode)
                    : query.OrderByDescending(x => x.Zipcode),
                "notes" => param.IsSortAscending.HasValue && param.IsSortAscending.Value
                    ? query.OrderBy(x => x.Notes)
                    : query.OrderByDescending(x => x.Notes),
                "crossstreet1" => param.IsSortAscending.HasValue && param.IsSortAscending.Value
                    ? query.OrderBy(x => x.CrossStreet1)
                    : query.OrderByDescending(x => x.CrossStreet1),
                "crossstreet2" => param.IsSortAscending.HasValue && param.IsSortAscending.Value
                    ? query.OrderBy(x => x.CrossStreet2)
                    : query.OrderByDescending(x => x.CrossStreet2),
                _ => query.OrderByDescending(x => x.CreatedAt),
            };
        }
        else
        {
            query = query.OrderByDescending(x => x.CreatedAt);
        }

        return await PagedList<AddressDto>.CreateAsync(
            query.AsNoTracking().ProjectTo<AddressDto>(mapper.ConfigurationProvider),
            param.PageNumber, param.PageSize);
    }

    public async Task<List<ZipcodeAddressOption>> GetZipcodeAddressOptionsAsync(string zipcode) =>
        await context.Neighborhoods
            .Include(x => x.CityNeighborhood.City)
            .Include(x => x.CityNeighborhood.City.StateCity.State)
            .AsNoTracking()
            .Where(x => x.Zipcode == zipcode)
            .Select(x => new ZipcodeAddressOption
            {
                Neighborhood = x.Name,
                City = x.CityNeighborhood.City.Name,
                State = x.CityNeighborhood.City.StateCity.State.Name,
                Settlement = x.Settlement
            })
            .ToListAsync();

    public async Task<AddressDto?> CreateForUserByIdAsync(AppUser user, AddressCreateDto request)
    {
        var addressToCreate = new Address
        {
            Name = request.Name,
            Description = null,
            Street = request.Street,
            InteriorNumber = request.InteriorNumber,
            ExteriorNumber = request.ExteriorNumber,
            Neighborhood = request.Neighborhood,
            City = request.City,
            State = request.State,
            CountryCode = "MX",
            Country = "México",
            Zipcode = request.Zipcode,
            Notes = request.Notes,
            CrossStreet1 = null,
            CrossStreet2 = null,
        };

        if (request.IsDefault == true)
        {
            var existingMainAddresses = await context.UserAddresses
                .Where(ua => ua.UserId == user.Id && ua.IsMain)
                .ToListAsync();

            foreach (var ua in existingMainAddresses)
            {
                ua.IsMain = false;
            }
        }

        var userAddressToCreate = new UserAddress
        {
            User = user,
            Address = addressToCreate,
            IsMain = request.IsDefault ?? false,
            IsBilling = request.IsBilling ?? false,
        };

        context.UserAddresses.Add(userAddressToCreate);
        await context.SaveChangesAsync();

        return await context.Addresses
            .Where(x => x.Id == addressToCreate.Id)
            .ProjectTo<AddressDto>(mapper.ConfigurationProvider)
            .SingleOrDefaultAsync();
    }


    public async Task<bool> ExistsByIdAsync(int id) => await context.Addresses.AnyAsync(x => x.Id == id);

    public async Task<bool> DoctorHasAddressAsync(int doctorId, int addressId) =>
        await context.Addresses
            .Include(x => x.DoctorClinic)
            .AnyAsync(x => x.Id == addressId && x.DoctorClinic.DoctorId == doctorId);

    public async Task<List<OptionDto>> GetClinicOptionsForDoctorAsync(AddressParams param)
    {
        var query = Includes(context.Addresses).AsQueryable();

        if (param.DoctorId.HasValue)
        {
            query = query.Where(x => x.DoctorClinic.DoctorId == param.DoctorId);
        }

        return await query
            .AsNoTracking()
            .ProjectTo<OptionDto>(mapper.ConfigurationProvider)
            .ToListAsync();
    }

    private static IQueryable<Address> Includes(IQueryable<Address> query) =>
        query
            .AsSplitQuery()
            .AsQueryable()
            .Include(x => x.DoctorClinic.Clinic.ClinicLogo.Photo);
}
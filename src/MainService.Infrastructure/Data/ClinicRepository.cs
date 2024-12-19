using System.Security.Claims;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using MainService.Core.DTOs.Clinics;
using MainService.Core.Helpers.Pagination;
using MainService.Core.Helpers.Params;
using MainService.Core.Interfaces.Data;
using MainService.Core.Extensions;
using MainService.Models;
using Microsoft.EntityFrameworkCore;
using MainService.Models.Entities.Aggregate;
using MainService.Models.Entities;

namespace MainService.Infrastructure.Data;

public class ClinicRepository(DataContext context, IMapper mapper) : IClinicRepository
{
    public async Task<List<ClinicDto>> GetAllDtoAsync(ClinicParams param) =>
        await context.Addresses
            .AsNoTracking()
            .ProjectTo<ClinicDto>(mapper.ConfigurationProvider)
            .ToListAsync()
        ;
        

    public async Task<bool> ExistsByIdAndDoctorIdAsync(int id, int doctorId) =>
        await context.Addresses
            .Include(x => x.DoctorClinic)
            .AnyAsync(x => x.Id == id && x.DoctorClinic.DoctorId == doctorId)
        ;

    public async Task<ClinicDto?> GetDtoByIdAsync(int id) => 
        await context.Addresses
            .AsNoTracking()
            .ProjectTo<ClinicDto>(mapper.ConfigurationProvider)
            .SingleOrDefaultAsync(x => x.Id == id)
        ;

    public async Task<PagedList<ClinicDto>> GetPagedListAsync(ClinicParams param, ClaimsPrincipal user)
    {
        var query = context.Addresses
            .Include(x => x.DoctorClinic)
            .AsQueryable();

        IEnumerable<string> roles = user.GetRoles();
        int userId = user.GetUserId();

        if (!string.IsNullOrEmpty(param.Search))
        {
            string term = param.Search.ToLower();
            
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
                "id" => param.IsSortAscending.HasValue && param.IsSortAscending.Value ? query.OrderBy(x => x.Id) : query.OrderByDescending(x => x.Id),
                "name" => param.IsSortAscending.HasValue && param.IsSortAscending.Value ? query.OrderBy(x => x.Name) : query.OrderByDescending(x => x.Name),
                "description" => param.IsSortAscending.HasValue && param.IsSortAscending.Value ? query.OrderBy(x => x.Description) : query.OrderByDescending(x => x.Description),
                "street" => param.IsSortAscending.HasValue && param.IsSortAscending.Value ? query.OrderBy(x => x.Street) : query.OrderByDescending(x => x.Street),
                "interiornumber" => param.IsSortAscending.HasValue && param.IsSortAscending.Value ? query.OrderBy(x => x.InteriorNumber) : query.OrderByDescending(x => x.InteriorNumber),
                "exteriornumber" => param.IsSortAscending.HasValue && param.IsSortAscending.Value ? query.OrderBy(x => x.ExteriorNumber) : query.OrderByDescending(x => x.ExteriorNumber),
                "neighborhood" => param.IsSortAscending.HasValue && param.IsSortAscending.Value ? query.OrderBy(x => x.Neighborhood) : query.OrderByDescending(x => x.Neighborhood),
                "city" => param.IsSortAscending.HasValue && param.IsSortAscending.Value ? query.OrderBy(x => x.City) : query.OrderByDescending(x => x.City),
                "state" => param.IsSortAscending.HasValue && param.IsSortAscending.Value ? query.OrderBy(x => x.State) : query.OrderByDescending(x => x.State),
                "country" => param.IsSortAscending.HasValue && param.IsSortAscending.Value ? query.OrderBy(x => x.Country) : query.OrderByDescending(x => x.Country),
                "zipcode" => param.IsSortAscending.HasValue && param.IsSortAscending.Value ? query.OrderBy(x => x.Zipcode) : query.OrderByDescending(x => x.Zipcode),
                "notes" => param.IsSortAscending.HasValue && param.IsSortAscending.Value ? query.OrderBy(x => x.Notes) : query.OrderByDescending(x => x.Notes),
                "crossstreet1" => param.IsSortAscending.HasValue && param.IsSortAscending.Value ? query.OrderBy(x => x.CrossStreet1) : query.OrderByDescending(x => x.CrossStreet1),
                "crossstreet2" => param.IsSortAscending.HasValue && param.IsSortAscending.Value ? query.OrderBy(x => x.CrossStreet2) : query.OrderByDescending(x => x.CrossStreet2),
                _ => query.OrderByDescending(x => x.CreatedAt),
            };
        } else {
            query = query.OrderByDescending(x => x.CreatedAt);
        }

        return await PagedList<ClinicDto>.CreateAsync(
            query.AsNoTracking().ProjectTo<ClinicDto>(mapper.ConfigurationProvider),
            param.PageNumber, param.PageSize);
    }

    public async Task<bool> DoctorHasAddressAsync(int doctorId, int addressId) =>
        await context.Addresses
            .Include(x => x.DoctorClinic)
            .AnyAsync(x => x.Id == addressId && x.DoctorClinic.DoctorId == doctorId)
        ;

    public async Task<List<OptionDto>> GetClinicOptionsForDoctorAsync(AddressParams param)
    {
        IQueryable<Address> query = Includes(context.Addresses).AsQueryable();

        if (param.DoctorId.HasValue) {
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
            .Include(x => x.DoctorClinic.Clinic.ClinicLogo.Photo)
    ;

    public async Task<List<OptionDto>> GetOptionsAsync(ClinicParams param)
    {
        IQueryable<Address> query = context.Addresses
            .Include(x => x.DoctorClinic)
            .AsQueryable()
        ;

        if (param.DoctorId.HasValue) {
            query = query.Where(x => x.DoctorClinic.DoctorId == param.DoctorId.Value);
        }

        return await query
            .AsNoTracking()
            .ProjectTo<OptionDto>(mapper.ConfigurationProvider)
            .ToListAsync();
    }
}
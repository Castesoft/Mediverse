using Microsoft.EntityFrameworkCore;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using MainService.Core.Interfaces.Data;
using MainService.Models;
using MainService.Models.Entities;
using MainService.Core.Helpers.Pagination;
using MainService.Models.Entities.Aggregate;


namespace MainService.Infrastructure.Data;
public class SpecialtyRepository(DataContext context, IMapper mapper) : ISpecialtyRepository
{
    public async Task<SpecialtyDto?> FindDtoByNameAsync(string name) => 
        await context.Specialties.ProjectTo<SpecialtyDto>(mapper.ConfigurationProvider).AsNoTracking()
            .SingleOrDefaultAsync(x => x.Name == name);

    public async Task<Specialty?> GetByNameAsync(string name) =>
        await context.Specialties.SingleOrDefaultAsync(x => x.Name == name);

    public async Task<Specialty?> GetByCodeAsync(string code) =>
        await context.Specialties.SingleOrDefaultAsync(x => x.Code == code);

    public void Add(Specialty item) => context.Specialties.Add(item);
    public void Delete(Specialty item) => context.Specialties.Remove(item);

    public async Task<List<SpecialtyDto>> GetAllDtosAsync() => await context.Specialties
            .AsNoTracking()
            .ProjectTo<SpecialtyDto>(mapper.ConfigurationProvider)
            .ToListAsync();

    public async Task<Specialty?> GetAsNoTrackingByIdAsync(int id) =>
        await context.Specialties
            .AsNoTracking()
            .SingleOrDefaultAsync(x => x.Id == id)
        ;

    public async Task<Specialty?> GetByIdAsync(int id) =>
        await context.Specialties
            .SingleOrDefaultAsync(x => x.Id == id)
        ;

    public async Task<SpecialtyDto?> GetDtoByIdAsync(int id) =>
        await context.Specialties
            .ProjectTo<SpecialtyDto>(mapper.ConfigurationProvider)
            .SingleOrDefaultAsync(x => x.Id == id)
        ;

    public async Task<PagedList<SpecialtyDto>> GetPagedListAsync(SpecialtyParams param, bool getAll = false)
    {
        IQueryable<Specialty> query = context.Specialties.AsQueryable();

        if (!string.IsNullOrEmpty(param.Sort))
        {
            query = param.Sort.ToLower() switch
            {
                "id" => param.IsSortAscending.HasValue && param.IsSortAscending.Value ? query.OrderBy(x => x.Id) : query.OrderByDescending(x => x.Id),
                "code" => param.IsSortAscending.HasValue && param.IsSortAscending.Value ? query.OrderBy(x => x.Code) : query.OrderByDescending(x => x.Code),
                "codenumber" => param.IsSortAscending.HasValue && param.IsSortAscending.Value ? query.OrderBy(x => x.CodeNumber) : query.OrderByDescending(x => x.CodeNumber),
                "name" => param.IsSortAscending.HasValue && param.IsSortAscending.Value ? query.OrderBy(x => x.Name) : query.OrderByDescending(x => x.Name),
                "description" => param.IsSortAscending.HasValue && param.IsSortAscending.Value ? query.OrderBy(x => x.Description) : query.OrderByDescending(x => x.Description),
                "createdat" => param.IsSortAscending.HasValue && param.IsSortAscending.Value ? query.OrderBy(x => x.CreatedAt) : query.OrderByDescending(x => x.CreatedAt),
                _ => query.OrderByDescending(x => x.CreatedAt),
            };
        } else {
            query = query.OrderByDescending(x => x.CreatedAt);
        }

        if (!string.IsNullOrEmpty(param.Search))
        {
            string term = param.Search.ToLower();
            
            query = query.Where(
                x =>
                    !string.IsNullOrEmpty(x.Code) && x.Code.ToLower().Contains(term) ||
                    !string.IsNullOrEmpty(x.Name) && x.Name.ToLower().Contains(term) ||
                    !string.IsNullOrEmpty(x.Description) && x.Description.ToLower().Contains(term) ||
                    x.CodeNumber.HasValue && x.CodeNumber.Value.ToString().ToLower().Contains(term)
            );
        }

        return await PagedList<SpecialtyDto>.CreateAsync(
            query.ProjectTo<SpecialtyDto>(mapper.ConfigurationProvider),
            param.PageNumber,
            param.PageSize);
    }

    public async Task<List<OptionDto>> GetOptionsAsync() => 
        await context.Specialties
            .AsNoTracking()
            .ProjectTo<OptionDto>(mapper.ConfigurationProvider)
            .ToListAsync();

    public async Task<bool> ExistsByIdAsync(int id) =>
        await context.Specialties.AsNoTracking().AnyAsync(x => x.Id == id);

    public Task<bool> ExistsByNameAsync(string name) => 
        context.Specialties.AsNoTracking().AllAsync(x => x.Name != name);

    public Task<bool> ExistsByCodeAsync(string code) =>
        context.Specialties.AsNoTracking().AllAsync(x => x.Code != code);
}
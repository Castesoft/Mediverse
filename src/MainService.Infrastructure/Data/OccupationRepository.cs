using Microsoft.EntityFrameworkCore;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using MainService.Models;
using MainService.Core.Interfaces.Data;
using MainService.Core.DTOs;
using MainService.Models.Entities;
using MainService.Core.Helpers.Pagination;
using MainService.Models.Entities.Aggregate;

namespace MainService.Infrastructure.Data;
public class OccupationRepository(DataContext context, IMapper mapper) : IOccupationRepository
{
    public async Task<OccupationDto> FindDtoByNameAsync(string name) => 
        await context.Occupations.ProjectTo<OccupationDto>(mapper.ConfigurationProvider).AsNoTracking()
            .SingleOrDefaultAsync(x => EF.Functions.Like(x.Name, name));

    public async Task<Occupation> GetByNameAsync(string name) =>
        await context.Occupations.SingleOrDefaultAsync(x => EF.Functions.Like(x.Name, name));

    public async Task<Occupation> GetByCodeAsync(string code) =>
        await context.Occupations.SingleOrDefaultAsync(x => EF.Functions.Like(x.Code, code));

    public void Add(Occupation item) => context.Occupations.Add(item);
    public void Delete(Occupation item) => context.Occupations.Remove(item);

    public async Task<List<OccupationDto>> GetAllDtosAsync() => await context.Occupations
            .AsNoTracking()
            .ProjectTo<OccupationDto>(mapper.ConfigurationProvider)
            .ToListAsync();

    public async Task<Occupation> GetAsNoTrackingByIdAsync(int id) =>
        await context.Occupations
            .AsNoTracking()
            .SingleOrDefaultAsync(x => x.Id == id);

    public async Task<Occupation> GetByIdAsync(int id) =>
        await context.Occupations
            .SingleOrDefaultAsync(x => x.Id == id);

    public async Task<OccupationDto> GetDtoByIdAsync(int id) =>
        await context.Occupations
            .ProjectTo<OccupationDto>(mapper.ConfigurationProvider)
            .SingleOrDefaultAsync(x => x.Id == id);

    public async Task<PagedList<OccupationDto>> GetPagedListAsync(OccupationParams param, bool getAll = false)
    {
        IQueryable<Occupation> query = context.Occupations.AsQueryable();

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

        return await PagedList<OccupationDto>.CreateAsync(
            query.ProjectTo<OccupationDto>(mapper.ConfigurationProvider),
            param.PageNumber,
            param.PageSize);
    }

    public async Task<List<OptionDto>> GetOptionsAsync() => 
        await context.Occupations
            .AsNoTracking()
            .ProjectTo<OptionDto>(mapper.ConfigurationProvider)
            .ToListAsync();

    public async Task<bool> ExistsByIdAsync(int id) =>
        await context.Occupations.AsNoTracking().AnyAsync(x => x.Id == id);

    public Task<bool> ExistsByNameAsync(string name) => 
        context.Occupations.AsNoTracking().AllAsync(x => x.Name != name);

    public Task<bool> ExistsByCodeAsync(string code) =>
        context.Occupations.AsNoTracking().AllAsync(x => x.Code != code);
}
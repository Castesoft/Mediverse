using Microsoft.EntityFrameworkCore;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using MainService.Models;
using MainService.Core.Interfaces.Data;
using MainService.Core.DTOs.MedicalRecord;
using MainService.Models.Entities;
using MainService.Core.Helpers.Pagination;
using MainService.Models.Entities.Aggregate;

namespace MainService.Infrastructure.Data;
public class SubstanceRepository(DataContext context, IMapper mapper) : ISubstanceRepository
{
    public async Task<SubstanceDto?> FindDtoByNameAsync(string name) => 
        await context.Substances.ProjectTo<SubstanceDto>(mapper.ConfigurationProvider).AsNoTracking()
            .SingleOrDefaultAsync(x => x.Name == name);

    public async Task<Substance?> GetByNameAsync(string name) =>
        await context.Substances.SingleOrDefaultAsync(x => x.Name == name);

    public async Task<Substance?> GetByCodeAsync(string code) =>
        await context.Substances.SingleOrDefaultAsync(x => x.Code == code);

    public void Add(Substance item) => context.Substances.Add(item);
    public void Delete(Substance item) => context.Substances.Remove(item);

    public async Task<List<SubstanceDto>> GetAllDtosAsync() => await context.Substances
            .AsNoTracking()
            .ProjectTo<SubstanceDto>(mapper.ConfigurationProvider)
            .ToListAsync();

    public async Task<Substance?> GetAsNoTrackingByIdAsync(int id) =>
        await context.Substances
            .AsNoTracking()
            .SingleOrDefaultAsync(x => x.Id == id);

    public async Task<Substance?> GetByIdAsync(int id) =>
        await context.Substances
            .SingleOrDefaultAsync(x => x.Id == id);

    public async Task<SubstanceDto?> GetDtoByIdAsync(int id) =>
        await context.Substances
            .ProjectTo<SubstanceDto>(mapper.ConfigurationProvider)
            .SingleOrDefaultAsync(x => x.Id == id);

    public async Task<PagedList<SubstanceDto>> GetPagedListAsync(SubstanceParams param, bool getAll = false)
    {
        IQueryable<Substance> query = context.Substances.AsQueryable();

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

        return await PagedList<SubstanceDto>.CreateAsync(
            query.ProjectTo<SubstanceDto>(mapper.ConfigurationProvider),
            param.PageNumber,
            param.PageSize);
    }

    public async Task<List<OptionDto>> GetOptionsAsync() => 
        await context.Substances
            .AsNoTracking()
            .ProjectTo<OptionDto>(mapper.ConfigurationProvider)
            .ToListAsync();

    public async Task<bool> ExistsByIdAsync(int id) =>
        await context.Substances.AsNoTracking().AnyAsync(x => x.Id == id);

    public Task<bool> ExistsByNameAsync(string name) => 
        context.Substances.AsNoTracking().AllAsync(x => x.Name != name);

    public Task<bool> ExistsByCodeAsync(string code) =>
        context.Substances.AsNoTracking().AllAsync(x => x.Code != code);
}
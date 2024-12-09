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
public class ConsumptionLevelRepository(DataContext context, IMapper mapper) : IConsumptionLevelRepository
{
    public async Task<ConsumptionLevelDto> FindDtoByNameAsync(string name) => 
        await context.ConsumptionLevels.ProjectTo<ConsumptionLevelDto>(mapper.ConfigurationProvider).AsNoTracking()
            .SingleOrDefaultAsync(x => EF.Functions.Like(x.Name, name));

    public async Task<ConsumptionLevel> GetByNameAsync(string name) =>
        await context.ConsumptionLevels.SingleOrDefaultAsync(x => EF.Functions.Like(x.Name, name));

    public async Task<ConsumptionLevel> GetByCodeAsync(string code) =>
        await context.ConsumptionLevels.SingleOrDefaultAsync(x => EF.Functions.Like(x.Code, code));

    public void Add(ConsumptionLevel item) => context.ConsumptionLevels.Add(item);
    public void Delete(ConsumptionLevel item) => context.ConsumptionLevels.Remove(item);

    public async Task<List<ConsumptionLevelDto>> GetAllDtosAsync() => await context.ConsumptionLevels
            .AsNoTracking()
            .ProjectTo<ConsumptionLevelDto>(mapper.ConfigurationProvider)
            .ToListAsync();

    public async Task<ConsumptionLevel> GetAsNoTrackingByIdAsync(int id) =>
        await context.ConsumptionLevels
            .AsNoTracking()
            .SingleOrDefaultAsync(x => x.Id == id);

    public async Task<ConsumptionLevel> GetByIdAsync(int id) =>
        await context.ConsumptionLevels
            .SingleOrDefaultAsync(x => x.Id == id);

    public async Task<ConsumptionLevelDto> GetDtoByIdAsync(int id) =>
        await context.ConsumptionLevels
            .ProjectTo<ConsumptionLevelDto>(mapper.ConfigurationProvider)
            .SingleOrDefaultAsync(x => x.Id == id);

    public async Task<PagedList<ConsumptionLevelDto>> GetPagedListAsync(ConsumptionLevelParams param, bool getAll = false)
    {
        IQueryable<ConsumptionLevel> query = context.ConsumptionLevels.AsQueryable();

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

        return await PagedList<ConsumptionLevelDto>.CreateAsync(
            query.ProjectTo<ConsumptionLevelDto>(mapper.ConfigurationProvider),
            param.PageNumber,
            param.PageSize);
    }

    public async Task<List<OptionDto>> GetOptionsAsync() => 
        await context.ConsumptionLevels
            .AsNoTracking()
            .ProjectTo<OptionDto>(mapper.ConfigurationProvider)
            .ToListAsync();

    public async Task<bool> ExistsByIdAsync(int id) =>
        await context.ConsumptionLevels.AsNoTracking().AnyAsync(x => x.Id == id);

    public Task<bool> ExistsByNameAsync(string name) => 
        context.ConsumptionLevels.AsNoTracking().AllAsync(x => x.Name != name);

    public Task<bool> ExistsByCodeAsync(string code) =>
        context.ConsumptionLevels.AsNoTracking().AllAsync(x => x.Code != code);
}
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
public class RelativeTypeRepository(DataContext context, IMapper mapper) : IRelativeTypeRepository
{
    public async Task<RelativeTypeDto?> FindDtoByNameAsync(string name) => 
        await context.RelativeTypes.ProjectTo<RelativeTypeDto>(mapper.ConfigurationProvider).AsNoTracking()
            .SingleOrDefaultAsync(x => x.Name == name);

    public async Task<RelativeType?> GetByNameAsync(string name) =>
        await context.RelativeTypes.SingleOrDefaultAsync(x => x.Name == name);

    public async Task<RelativeType?> GetByCodeAsync(string code) =>
        await context.RelativeTypes.SingleOrDefaultAsync(x => x.Code == code);

    public void Add(RelativeType item) => context.RelativeTypes.Add(item);
    public void Delete(RelativeType item) => context.RelativeTypes.Remove(item);

    public async Task<List<RelativeTypeDto>> GetAllDtosAsync() => await context.RelativeTypes
            .AsNoTracking()
            .ProjectTo<RelativeTypeDto>(mapper.ConfigurationProvider)
            .ToListAsync();

    public async Task<RelativeType?> GetAsNoTrackingByIdAsync(int id) =>
        await context.RelativeTypes
            .AsNoTracking()
            .SingleOrDefaultAsync(x => x.Id == id);

    public async Task<RelativeType?> GetByIdAsync(int id) =>
        await context.RelativeTypes
            .SingleOrDefaultAsync(x => x.Id == id);

    public async Task<RelativeTypeDto?> GetDtoByIdAsync(int id) =>
        await context.RelativeTypes
            .ProjectTo<RelativeTypeDto>(mapper.ConfigurationProvider)
            .SingleOrDefaultAsync(x => x.Id == id);

    public async Task<PagedList<RelativeTypeDto>> GetPagedListAsync(RelativeTypeParams param, bool getAll = false)
    {
        IQueryable<RelativeType> query = context.RelativeTypes.AsQueryable();

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

        return await PagedList<RelativeTypeDto>.CreateAsync(
            query.ProjectTo<RelativeTypeDto>(mapper.ConfigurationProvider),
            param.PageNumber,
            param.PageSize);
    }

    public async Task<List<OptionDto>> GetOptionsAsync() => 
        await context.RelativeTypes
            .AsNoTracking()
            .ProjectTo<OptionDto>(mapper.ConfigurationProvider)
            .ToListAsync();

    public async Task<bool> ExistsByIdAsync(int id) =>
        await context.RelativeTypes.AsNoTracking().AnyAsync(x => x.Id == id);

    public Task<bool> ExistsByNameAsync(string name) => 
        context.RelativeTypes.AsNoTracking().AllAsync(x => x.Name != name);

    public Task<bool> ExistsByCodeAsync(string code) =>
        context.RelativeTypes.AsNoTracking().AllAsync(x => x.Code != code);
}
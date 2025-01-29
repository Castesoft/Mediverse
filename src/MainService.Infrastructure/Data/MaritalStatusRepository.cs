using Microsoft.EntityFrameworkCore;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using MainService.Models;
using MainService.Core.Interfaces.Data;
using MainService.Core.DTOs;
using MainService.Core.DTOs.MedicalRecord;
using MainService.Models.Entities;
using MainService.Core.Helpers.Pagination;
using MainService.Models.Entities.Aggregate;

namespace MainService.Infrastructure.Data;
public class MaritalStatusRepository(DataContext context, IMapper mapper) : IMaritalStatusRepository
{
    public async Task<MaritalStatusDto?> FindDtoByNameAsync(string name) => 
        await context.MaritalStatuses.ProjectTo<MaritalStatusDto>(mapper.ConfigurationProvider).AsNoTracking()
            .SingleOrDefaultAsync(x => x.Name == name);

    public async Task<MaritalStatus?> GetByNameAsync(string name) =>
        await context.MaritalStatuses.SingleOrDefaultAsync(x => x.Name == name);

    public async Task<MaritalStatus?> GetByCodeAsync(string code) =>
        await context.MaritalStatuses.SingleOrDefaultAsync(x => x.Code == code);

    public void Add(MaritalStatus item) => context.MaritalStatuses.Add(item);
    public void Delete(MaritalStatus item) => context.MaritalStatuses.Remove(item);

    public async Task<List<MaritalStatusDto>> GetAllDtosAsync() => await context.MaritalStatuses
            .AsNoTracking()
            .ProjectTo<MaritalStatusDto>(mapper.ConfigurationProvider)
            .ToListAsync();

    public async Task<MaritalStatus?> GetAsNoTrackingByIdAsync(int id) =>
        await context.MaritalStatuses
            .AsNoTracking()
            .SingleOrDefaultAsync(x => x.Id == id);

    public async Task<MaritalStatus?> GetByIdAsync(int id) =>
        await context.MaritalStatuses
            .SingleOrDefaultAsync(x => x.Id == id);

    public async Task<MaritalStatusDto?> GetDtoByIdAsync(int id) =>
        await context.MaritalStatuses
            .ProjectTo<MaritalStatusDto>(mapper.ConfigurationProvider)
            .SingleOrDefaultAsync(x => x.Id == id);

    public async Task<PagedList<MaritalStatusDto>> GetPagedListAsync(MaritalStatusParams param, bool getAll = false)
    {
        IQueryable<MaritalStatus> query = context.MaritalStatuses.AsQueryable();

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

        return await PagedList<MaritalStatusDto>.CreateAsync(
            query.ProjectTo<MaritalStatusDto>(mapper.ConfigurationProvider),
            param.PageNumber,
            param.PageSize);
    }

    public async Task<List<OptionDto>> GetOptionsAsync() => 
        await context.MaritalStatuses
            .AsNoTracking()
            .ProjectTo<OptionDto>(mapper.ConfigurationProvider)
            .ToListAsync();

    public async Task<bool> ExistsByIdAsync(int id) =>
        await context.MaritalStatuses.AsNoTracking().AnyAsync(x => x.Id == id);

    public Task<bool> ExistsByNameAsync(string name) => 
        context.MaritalStatuses.AsNoTracking().AllAsync(x => x.Name != name);

    public Task<bool> ExistsByCodeAsync(string code) =>
        context.MaritalStatuses.AsNoTracking().AllAsync(x => x.Code != code);
}
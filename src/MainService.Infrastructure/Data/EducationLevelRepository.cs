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
public class EducationLevelRepository(DataContext context, IMapper mapper) : IEducationLevelRepository
{
    public async Task<EducationLevelDto?> FindDtoByNameAsync(string name) => 
        await context.EducationLevels.ProjectTo<EducationLevelDto>(mapper.ConfigurationProvider).AsNoTracking()
            .SingleOrDefaultAsync(x => x.Name == name);

    public async Task<EducationLevel?> GetByNameAsync(string name) =>
        await context.EducationLevels.SingleOrDefaultAsync(x => x.Name == name);

    public async Task<EducationLevel?> GetByCodeAsync(string code) =>
        await context.EducationLevels.SingleOrDefaultAsync(x => x.Code == code);

    public void Add(EducationLevel item) => context.EducationLevels.Add(item);
    public void Delete(EducationLevel item) => context.EducationLevels.Remove(item);

    public async Task<List<EducationLevelDto>> GetAllDtosAsync() => await context.EducationLevels
            .AsNoTracking()
            .ProjectTo<EducationLevelDto>(mapper.ConfigurationProvider)
            .ToListAsync();

    public async Task<EducationLevel?> GetAsNoTrackingByIdAsync(int id) =>
        await context.EducationLevels
            .AsNoTracking()
            .SingleOrDefaultAsync(x => x.Id == id);

    public async Task<EducationLevel?> GetByIdAsync(int id) =>
        await context.EducationLevels
            .SingleOrDefaultAsync(x => x.Id == id);

    public async Task<EducationLevelDto?> GetDtoByIdAsync(int id) =>
        await context.EducationLevels
            .ProjectTo<EducationLevelDto>(mapper.ConfigurationProvider)
            .SingleOrDefaultAsync(x => x.Id == id);

    public async Task<PagedList<EducationLevelDto>> GetPagedListAsync(EducationLevelParams param, bool getAll = false)
    {
        IQueryable<EducationLevel> query = context.EducationLevels.AsQueryable();

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

        return await PagedList<EducationLevelDto>.CreateAsync(
            query.ProjectTo<EducationLevelDto>(mapper.ConfigurationProvider),
            param.PageNumber,
            param.PageSize);
    }

    public async Task<List<OptionDto>> GetOptionsAsync() => 
        await context.EducationLevels
            .AsNoTracking()
            .ProjectTo<OptionDto>(mapper.ConfigurationProvider)
            .ToListAsync();

    public async Task<bool> ExistsByIdAsync(int id) =>
        await context.EducationLevels.AsNoTracking().AnyAsync(x => x.Id == id);

    public Task<bool> ExistsByNameAsync(string name) => 
        context.EducationLevels.AsNoTracking().AllAsync(x => x.Name != name);

    public Task<bool> ExistsByCodeAsync(string code) =>
        context.EducationLevels.AsNoTracking().AllAsync(x => x.Code != code);
}
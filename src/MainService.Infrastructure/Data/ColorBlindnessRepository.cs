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
public class ColorBlindnessRepository(DataContext context, IMapper mapper) : IColorBlindnessRepository
{
    public async Task<ColorBlindnessDto?> FindDtoByNameAsync(string name) => 
        await context.ColorBlindnesses.ProjectTo<ColorBlindnessDto>(mapper.ConfigurationProvider).AsNoTracking()
            .SingleOrDefaultAsync(x => x.Name == name);

    public async Task<ColorBlindness?> GetByNameAsync(string name) =>
        await context.ColorBlindnesses.SingleOrDefaultAsync(x => x.Name == name);

    public async Task<ColorBlindness?> GetByCodeAsync(string code) =>
        await context.ColorBlindnesses.SingleOrDefaultAsync(x => x.Code == code);

    public void Add(ColorBlindness item) => context.ColorBlindnesses.Add(item);
    public void Delete(ColorBlindness item) => context.ColorBlindnesses.Remove(item);

    public async Task<List<ColorBlindnessDto>> GetAllDtosAsync() => await context.ColorBlindnesses
            .AsNoTracking()
            .ProjectTo<ColorBlindnessDto>(mapper.ConfigurationProvider)
            .ToListAsync();

    public async Task<ColorBlindness?> GetAsNoTrackingByIdAsync(int id) =>
        await context.ColorBlindnesses
            .AsNoTracking()
            .SingleOrDefaultAsync(x => x.Id == id);

    public async Task<ColorBlindness?> GetByIdAsync(int id) =>
        await context.ColorBlindnesses
            .SingleOrDefaultAsync(x => x.Id == id);

    public async Task<ColorBlindnessDto?> GetDtoByIdAsync(int id) =>
        await context.ColorBlindnesses
            .ProjectTo<ColorBlindnessDto>(mapper.ConfigurationProvider)
            .SingleOrDefaultAsync(x => x.Id == id);

    public async Task<PagedList<ColorBlindnessDto>> GetPagedListAsync(ColorBlindnessParams param, bool getAll = false)
    {
        IQueryable<ColorBlindness> query = context.ColorBlindnesses.AsQueryable();

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

        return await PagedList<ColorBlindnessDto>.CreateAsync(
            query.ProjectTo<ColorBlindnessDto>(mapper.ConfigurationProvider),
            param.PageNumber,
            param.PageSize);
    }

    public async Task<List<OptionDto>> GetOptionsAsync() => 
        await context.ColorBlindnesses
            .AsNoTracking()
            .ProjectTo<OptionDto>(mapper.ConfigurationProvider)
            .ToListAsync();

    public async Task<bool> ExistsByIdAsync(int id) =>
        await context.ColorBlindnesses.AsNoTracking().AnyAsync(x => x.Id == id);

    public Task<bool> ExistsByNameAsync(string name) => 
        context.ColorBlindnesses.AsNoTracking().AllAsync(x => x.Name != name);

    public Task<bool> ExistsByCodeAsync(string code) =>
        context.ColorBlindnesses.AsNoTracking().AllAsync(x => x.Code != code);
}
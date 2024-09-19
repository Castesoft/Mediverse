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
    public async Task<ColorBlindnessDto> FindDtoByNameAsync(string name) => 
        await context.ColorBlindnesses.ProjectTo<ColorBlindnessDto>(mapper.ConfigurationProvider).AsNoTracking()
            .SingleOrDefaultAsync(x => EF.Functions.Like(x.Name, name));

    public async Task<ColorBlindness> GetByNameAsync(string name) =>
        await context.ColorBlindnesses.SingleOrDefaultAsync(x => EF.Functions.Like(x.Name, name));

    public async Task<ColorBlindness> GetByCodeAsync(string code) =>
        await context.ColorBlindnesses.SingleOrDefaultAsync(x => EF.Functions.Like(x.Code, code));

    public void Add(ColorBlindness item) => context.ColorBlindnesses.Add(item);
    public void Delete(ColorBlindness item) => context.ColorBlindnesses.Remove(item);

    public async Task<List<ColorBlindnessDto>> GetAllDtosAsync() => await context.ColorBlindnesses
            .AsNoTracking()
            .ProjectTo<ColorBlindnessDto>(mapper.ConfigurationProvider)
            .ToListAsync();

    public async Task<ColorBlindness> GetAsNoTrackingByIdAsync(int id) =>
        await context.ColorBlindnesses
            .AsNoTracking()
            .SingleOrDefaultAsync(x => x.Id == id);

    public async Task<ColorBlindness> GetByIdAsync(int id) =>
        await context.ColorBlindnesses
            .SingleOrDefaultAsync(x => x.Id == id);

    public async Task<ColorBlindnessDto> GetDtoByIdAsync(int id) =>
        await context.ColorBlindnesses
            .ProjectTo<ColorBlindnessDto>(mapper.ConfigurationProvider)
            .SingleOrDefaultAsync(x => x.Id == id);

    public async Task<PagedList<ColorBlindnessDto>> GetPagedListAsync(ColorBlindnessParams param, bool getAll = false)
    {
        IQueryable<ColorBlindness> query = context.ColorBlindnesses.AsQueryable();

        if (!string.IsNullOrEmpty(param.Name)) query = query.Where(x => x.Name.Contains(param.Name));
        if (!string.IsNullOrEmpty(param.Code)) query = query.Where(x => x.Code.Contains(param.Code));
        if (!string.IsNullOrEmpty(param.LastName)) query = query.Where(x => x.LastName.Contains(param.LastName));
        if (!string.IsNullOrEmpty(param.Description)) query = query.Where(x => x.Description.Contains(param.Description));
        if (!string.IsNullOrEmpty(param.Color)) query = query.Where(x => x.Color.Contains(param.Color));
        if (param.CodeNumber > 0) query = query.Where(x => x.CodeNumber == param.CodeNumber);

        if (param.Sort != null && !string.IsNullOrEmpty(param.Sort.Code))
        {
            query = param.Sort.Code.ToLower() switch
            {
                "id" => param.IsSortAscending
                                        ? query.OrderBy(x => x.Id)
                                        : query.OrderByDescending(x => x.Id),
                "name" => param.IsSortAscending
                                        ? query.OrderBy(x => x.Name)
                                        : query.OrderByDescending(x => x.Name),
                "lastname" => param.IsSortAscending
                                        ? query.OrderBy(x => x.LastName)
                                        : query.OrderByDescending(x => x.LastName),
                "code" => param.IsSortAscending
                                        ? query.OrderBy(x => x.Code)
                                        : query.OrderByDescending(x => x.Code),
                "codenumber" => param.IsSortAscending
                                        ? query.OrderBy(x => x.CodeNumber)
                                        : query.OrderByDescending(x => x.CodeNumber),
                "color" => param.IsSortAscending
                                        ? query.OrderBy(x => x.Color)
                                        : query.OrderByDescending(x => x.Color),
                "description" => param.IsSortAscending
                                        ? query.OrderBy(x => x.Description)
                                        : query.OrderByDescending(x => x.Description),
                _ => query.OrderBy(x => x.Id),
            };
        }

        if (!string.IsNullOrEmpty(param.Search))
        {
            query = query.Where(
                x => EF.Functions.Like(x.Name.ToLower(), $"%{param.Search}%")
                     || EF.Functions.Like(x.Code.ToLower(), $"%{param.Search}%")
                     || EF.Functions.Like(x.CodeNumber.ToString(), $"%{param.Search}%")
                     || EF.Functions.Like(x.Color.ToString(), $"%{param.Search}%")
                     || EF.Functions.Like(x.Description.ToString(), $"%{param.Search}%")
                     || EF.Functions.Like(x.LastName.ToString(), $"%{param.Search}%")
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
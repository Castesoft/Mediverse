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
    public async Task<RelativeTypeDto> FindDtoByNameAsync(string name) => 
        await context.RelativeTypes.ProjectTo<RelativeTypeDto>(mapper.ConfigurationProvider).AsNoTracking()
            .SingleOrDefaultAsync(x => EF.Functions.Like(x.Name, name));

    public async Task<RelativeType> GetByNameAsync(string name) =>
        await context.RelativeTypes.SingleOrDefaultAsync(x => EF.Functions.Like(x.Name, name));

    public async Task<RelativeType> GetByCodeAsync(string code) =>
        await context.RelativeTypes.SingleOrDefaultAsync(x => EF.Functions.Like(x.Code, code));

    public void Add(RelativeType item) => context.RelativeTypes.Add(item);
    public void Delete(RelativeType item) => context.RelativeTypes.Remove(item);

    public async Task<List<RelativeTypeDto>> GetAllDtosAsync() => await context.RelativeTypes
            .AsNoTracking()
            .ProjectTo<RelativeTypeDto>(mapper.ConfigurationProvider)
            .ToListAsync();

    public async Task<RelativeType> GetAsNoTrackingByIdAsync(int id) =>
        await context.RelativeTypes
            .AsNoTracking()
            .SingleOrDefaultAsync(x => x.Id == id);

    public async Task<RelativeType> GetByIdAsync(int id) =>
        await context.RelativeTypes
            .SingleOrDefaultAsync(x => x.Id == id);

    public async Task<RelativeTypeDto> GetDtoByIdAsync(int id) =>
        await context.RelativeTypes
            .ProjectTo<RelativeTypeDto>(mapper.ConfigurationProvider)
            .SingleOrDefaultAsync(x => x.Id == id);

    public async Task<PagedList<RelativeTypeDto>> GetPagedListAsync(RelativeTypeParams param, bool getAll = false)
    {
        IQueryable<RelativeType> query = context.RelativeTypes.AsQueryable();

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
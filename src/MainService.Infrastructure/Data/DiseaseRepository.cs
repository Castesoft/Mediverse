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
public class DiseaseRepository(DataContext context, IMapper mapper) : IDiseaseRepository
{
    public async Task<DiseaseDto> FindDtoByNameAsync(string name) => 
        await context.Diseases.ProjectTo<DiseaseDto>(mapper.ConfigurationProvider).AsNoTracking()
            .SingleOrDefaultAsync(x => EF.Functions.Like(x.Name, name));

    public async Task<Disease> GetByNameAsync(string name) =>
        await context.Diseases.SingleOrDefaultAsync(x => EF.Functions.Like(x.Name, name));

    public async Task<Disease> GetByCodeAsync(string code) =>
        await context.Diseases.SingleOrDefaultAsync(x => EF.Functions.Like(x.Code, code));

    public void Add(Disease item) => context.Diseases.Add(item);
    public void Delete(Disease item) => context.Diseases.Remove(item);

    public async Task<List<DiseaseDto>> GetAllDtosAsync() => await context.Diseases
            .AsNoTracking()
            .ProjectTo<DiseaseDto>(mapper.ConfigurationProvider)
            .ToListAsync();

    public async Task<Disease> GetAsNoTrackingByIdAsync(int id) =>
        await context.Diseases
            .AsNoTracking()
            .SingleOrDefaultAsync(x => x.Id == id);

    public async Task<Disease> GetByIdAsync(int id) =>
        await context.Diseases
            .SingleOrDefaultAsync(x => x.Id == id);

    public async Task<DiseaseDto> GetDtoByIdAsync(int id) =>
        await context.Diseases
            .ProjectTo<DiseaseDto>(mapper.ConfigurationProvider)
            .SingleOrDefaultAsync(x => x.Id == id);

    public async Task<PagedList<DiseaseDto>> GetPagedListAsync(DiseaseParams param, bool getAll = false)
    {
        IQueryable<Disease> query = context.Diseases.AsQueryable();

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

        return await PagedList<DiseaseDto>.CreateAsync(
            query.ProjectTo<DiseaseDto>(mapper.ConfigurationProvider),
            param.PageNumber,
            param.PageSize);
    }

    public async Task<List<OptionDto>> GetOptionsAsync() => 
        await context.Diseases
            .AsNoTracking()
            .ProjectTo<OptionDto>(mapper.ConfigurationProvider)
            .ToListAsync();

    public async Task<bool> ExistsByIdAsync(int id) =>
        await context.Diseases.AsNoTracking().AnyAsync(x => x.Id == id);

    public Task<bool> ExistsByNameAsync(string name) => 
        context.Diseases.AsNoTracking().AllAsync(x => x.Name != name);

    public Task<bool> ExistsByCodeAsync(string code) =>
        context.Diseases.AsNoTracking().AllAsync(x => x.Code != code);
}
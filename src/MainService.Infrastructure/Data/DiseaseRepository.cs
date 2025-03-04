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
public class DiseaseRepository(DataContext context, IMapper mapper) : IDiseaseRepository
{
    public async Task<DiseaseDto?> FindDtoByNameAsync(string name) => 
        await context.Diseases.ProjectTo<DiseaseDto>(mapper.ConfigurationProvider).AsNoTracking()
            .SingleOrDefaultAsync(x => x.Name == name);

    public async Task<Disease?> GetByNameAsync(string name) =>
        await context.Diseases.SingleOrDefaultAsync(x => x.Name == name);

    public async Task<Disease?> GetByCodeAsync(string code) =>
        await context.Diseases.SingleOrDefaultAsync(x => x.Code == code);

    public void Add(Disease item) => context.Diseases.Add(item);
    public void Delete(Disease item) => context.Diseases.Remove(item);

    public async Task<List<DiseaseDto>> GetAllDtosAsync() => await context.Diseases
            .AsNoTracking()
            .ProjectTo<DiseaseDto>(mapper.ConfigurationProvider)
            .ToListAsync();

    public async Task<Disease?> GetAsNoTrackingByIdAsync(int id) =>
        await context.Diseases
            .AsNoTracking()
            .SingleOrDefaultAsync(x => x.Id == id);

    public async Task<Disease?> GetByIdAsync(int id) =>
        await context.Diseases
            .SingleOrDefaultAsync(x => x.Id == id);

    public async Task<DiseaseDto?> GetDtoByIdAsync(int id) =>
        await context.Diseases
            .ProjectTo<DiseaseDto>(mapper.ConfigurationProvider)
            .SingleOrDefaultAsync(x => x.Id == id);

    public async Task<PagedList<DiseaseDto>> GetPagedListAsync(DiseaseParams param, bool getAll = false)
    {
        IQueryable<Disease> query = context.Diseases.AsQueryable();

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
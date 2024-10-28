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
public class DocumentRepository(DataContext context, IMapper mapper) : IDocumentRepository
{
    public async Task<DocumentDto> FindDtoByNameAsync(string name) => 
        await context.Documents.ProjectTo<DocumentDto>(mapper.ConfigurationProvider).AsNoTracking()
            .SingleOrDefaultAsync(x => x.Name == name);

    public async Task<Document> GetByNameAsync(string name) =>
        await context.Documents.SingleOrDefaultAsync(x => x.Name == name);

    public void Add(Document item) => context.Documents.Add(item);
    public void Delete(Document item) => context.Documents.Remove(item);

    public async Task<List<DocumentDto>> GetAllDtosAsync() => await context.Documents
            .AsNoTracking()
            .ProjectTo<DocumentDto>(mapper.ConfigurationProvider)
            .ToListAsync();

    public async Task<Document> GetAsNoTrackingByIdAsync(int id) =>
        await context.Documents
            .AsNoTracking()
            .SingleOrDefaultAsync(x => x.Id == id);

    public async Task<Document> GetByIdAsync(int id) =>
        await context.Documents
            .SingleOrDefaultAsync(x => x.Id == id);

    public async Task<DocumentDto> GetDtoByIdAsync(int id) =>
        await context.Documents
            .ProjectTo<DocumentDto>(mapper.ConfigurationProvider)
            .SingleOrDefaultAsync(x => x.Id == id);

    public async Task<PagedList<DocumentDto>> GetPagedListAsync(DocumentParams param, bool getAll = false)
    {
        IQueryable<Document> query = context.Documents.AsQueryable();

        if (!string.IsNullOrEmpty(param.Name)) query = query.Where(x => x.Name.Contains(param.Name));
        if (!string.IsNullOrEmpty(param.Description)) query = query.Where(x => x.Description.Contains(param.Description));

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
            );
        }

        return await PagedList<DocumentDto>.CreateAsync(
            query.ProjectTo<DocumentDto>(mapper.ConfigurationProvider),
            param.PageNumber,
            param.PageSize);
    }

    public async Task<List<OptionDto>> GetOptionsAsync() => 
        await context.Documents
            .AsNoTracking()
            .ProjectTo<OptionDto>(mapper.ConfigurationProvider)
            .ToListAsync();

    public async Task<bool> ExistsByIdAsync(int id) =>
        await context.Documents.AsNoTracking().AnyAsync(x => x.Id == id);

    public Task<bool> ExistsByNameAsync(string name) => 
        context.Documents.AsNoTracking().AllAsync(x => x.Name != name);
}
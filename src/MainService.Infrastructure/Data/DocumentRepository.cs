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
    public async Task<DocumentDto?> FindDtoByNameAsync(string name) => 
        await context.Documents.ProjectTo<DocumentDto>(mapper.ConfigurationProvider).AsNoTracking()
            .SingleOrDefaultAsync(x => x.Name == name);

    public async Task<Document?> GetByNameAsync(string name) =>
        await context.Documents.SingleOrDefaultAsync(x => x.Name == name);

    public void Add(Document item) => context.Documents.Add(item);
    public void Delete(Document item) => context.Documents.Remove(item);

    public async Task<List<DocumentDto>> GetAllDtosAsync() => await context.Documents
            .AsNoTracking()
            .ProjectTo<DocumentDto>(mapper.ConfigurationProvider)
            .ToListAsync();

    public async Task<Document?> GetAsNoTrackingByIdAsync(int id) =>
        await context.Documents
            .AsNoTracking()
            .SingleOrDefaultAsync(x => x.Id == id);

    public async Task<Document?> GetByIdAsync(int id) =>
        await context.Documents
            .SingleOrDefaultAsync(x => x.Id == id);

    public async Task<DocumentDto?> GetDtoByIdAsync(int id) =>
        await context.Documents
            .ProjectTo<DocumentDto>(mapper.ConfigurationProvider)
            .SingleOrDefaultAsync(x => x.Id == id);

    public async Task<PagedList<DocumentDto>> GetPagedListAsync(DocumentParams param, bool getAll = false)
    {
        IQueryable<Document> query = context.Documents.AsQueryable();

        if (!string.IsNullOrEmpty(param.Sort))
        {
            query = param.Sort.ToLower() switch
            {
                "id" => param.IsSortAscending.HasValue && param.IsSortAscending.Value ? query.OrderBy(x => x.Id) : query.OrderByDescending(x => x.Id),
                "name" => param.IsSortAscending.HasValue && param.IsSortAscending.Value ? query.OrderBy(x => x.Name) : query.OrderByDescending(x => x.Name),
                "description" => param.IsSortAscending.HasValue && param.IsSortAscending.Value ? query.OrderBy(x => x.Description) : query.OrderByDescending(x => x.Description),
                "url" => param.IsSortAscending.HasValue && param.IsSortAscending.Value ? query.OrderBy(x => x.Url) : query.OrderByDescending(x => x.Url),
                "publicid" => param.IsSortAscending.HasValue && param.IsSortAscending.Value ? query.OrderBy(x => x.PublicId) : query.OrderByDescending(x => x.PublicId),
                "thumbnailurl" => param.IsSortAscending.HasValue && param.IsSortAscending.Value ? query.OrderBy(x => x.ThumbnailUrl) : query.OrderByDescending(x => x.ThumbnailUrl),
                "thumbnailpublicid" => param.IsSortAscending.HasValue && param.IsSortAscending.Value ? query.OrderBy(x => x.ThumbnailPublicId) : query.OrderByDescending(x => x.ThumbnailPublicId),
                "thumbnailsize" => param.IsSortAscending.HasValue && param.IsSortAscending.Value ? query.OrderBy(x => x.ThumbnailSize) : query.OrderByDescending(x => x.ThumbnailSize),
                "size" => param.IsSortAscending.HasValue && param.IsSortAscending.Value ? query.OrderBy(x => x.Size) : query.OrderByDescending(x => x.Size),
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
                    !string.IsNullOrEmpty(x.Name) && x.Name.ToLower().Contains(term) ||
                    !string.IsNullOrEmpty(x.Description) && x.Description.ToLower().Contains(term) ||
                    !string.IsNullOrEmpty(x.Url) && x.Url.ToLower().Contains(term) ||
                    !string.IsNullOrEmpty(x.PublicId) && x.PublicId.ToLower().Contains(term) ||
                    !string.IsNullOrEmpty(x.ThumbnailUrl) && x.ThumbnailUrl.ToLower().Contains(term) ||
                    !string.IsNullOrEmpty(x.ThumbnailPublicId) && x.ThumbnailPublicId.ToLower().Contains(term) ||
                    x.Size.HasValue && x.Size.Value.ToString().ToLower().Contains(term) ||
                    x.ThumbnailSize.HasValue && x.ThumbnailSize.Value.ToString().ToLower().Contains(term)
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
using AutoMapper;
using AutoMapper.QueryableExtensions;
using MainService.Core.DTOs;
using MainService.Core.Helpers.Pagination;
using MainService.Core.Helpers.Params;
using MainService.Core.Interfaces.Data;
using MainService.Models;
using MainService.Models.Entities;
using Microsoft.EntityFrameworkCore;

namespace MainService.Infrastructure.Data;
public class PhotoRepository(DataContext context, IMapper mapper) : IPhotoRepository
{
    public void Add(Photo item)
    {
        context.Photos.Add(item);
    }

    public void Delete(Photo item)
    {
        context.Photos.Remove(item);
    }

    public async Task<List<Photo>> GetAllAsync()
    {
        return await context.Photos.ToListAsync();
    }

    public async Task<List<PhotoDto>> GetAllDtoAsync()
    {
        var query = context.Photos
            .AsNoTracking()
            .ProjectTo<PhotoDto>(mapper.ConfigurationProvider);

        return await query.ToListAsync();
    }

    public async Task<Photo?> GetByIdAsync(int id) =>
        await context.Photos
            .SingleOrDefaultAsync(x => x.Id == id);

    public async Task<Photo?> GetByUserIdAsync(int userId) =>
        await context.Photos
            .Include(x => x.UserPhoto)
            .FirstOrDefaultAsync(x => x.UserPhoto.UserId == userId)
        ;

    public async Task<PhotoDto?> GetDtoByIdAsync(int id) =>
        await context.Photos
            .AsNoTracking()
            .ProjectTo<PhotoDto>(mapper.ConfigurationProvider)
            .SingleOrDefaultAsync(x => x.Id == id)
        ;

    public async Task<PagedList<PhotoDto>> GetPagedListAsync(PhotoParams param)
    {
        IQueryable<Photo> query = context.Photos
            .AsQueryable()
        ;

        if (!string.IsNullOrEmpty(param.Sort))
        {
            query = param.Sort.ToLower() switch
            {
                "id" => param.IsSortAscending.HasValue && param.IsSortAscending.Value ? query.OrderBy(x => x.Id) : query.OrderByDescending(x => x.Id),
                "name" => param.IsSortAscending.HasValue && param.IsSortAscending.Value ? query.OrderBy(x => x.Name) : query.OrderByDescending(x => x.Name),
                "description" => param.IsSortAscending.HasValue && param.IsSortAscending.Value ? query.OrderBy(x => x.Description) : query.OrderByDescending(x => x.Description),
                "url" => param.IsSortAscending.HasValue && param.IsSortAscending.Value ? query.OrderBy(x => x.Url) : query.OrderByDescending(x => x.Url),
                "publicid" => param.IsSortAscending.HasValue && param.IsSortAscending.Value ? query.OrderBy(x => x.PublicId) : query.OrderByDescending(x => x.PublicId),
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
                    x.Size.HasValue && x.Size.Value.ToString().ToLower().Contains(term)
            );
        }

        return await PagedList<PhotoDto>.CreateAsync(
            query.AsNoTracking().ProjectTo<PhotoDto>(mapper.ConfigurationProvider),
            param.PageNumber, param.PageSize);
    }
}
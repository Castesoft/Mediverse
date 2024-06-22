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

    public async Task<Photo> GetByIdAsync(int id)
    {
        var item = await context.Photos
            .SingleOrDefaultAsync(x => x.Id == id);

        return item;
    }

    public async Task<Photo> GetByUserIdAsync(int userId)
    {
        return await context.Photos
            .Include(x => x.UserPhoto)
            .FirstOrDefaultAsync(x => x.UserPhoto.UserId == userId);
    }

    public async Task<PhotoDto> GetDtoByIdAsync(int id)
    {
        var item = await context.Photos
            .AsNoTracking()
            .ProjectTo<PhotoDto>(mapper.ConfigurationProvider)
            .SingleOrDefaultAsync(x => x.Id == id);

        return item;
    }

    public async Task<PagedList<PhotoDto>> GetPagedListAsync(PhotoParams param)
    {
        var query = context.Photos
            .AsQueryable();

        if (param.DateFrom != DateTime.MinValue)
            query = query.Where(x => x.CreatedAt >= param.DateFrom);

        if (param.DateTo != DateTime.MaxValue)
            query = query.Where(x => x.CreatedAt <= param.DateTo);

        if (!string.IsNullOrEmpty(param.Search))
        {
            string term = param.Search.ToLower();

            query = query.Where(x =>
                EF.Functions.Like(x.Name, $"%{term}%") ||
                EF.Functions.Like(x.Size.ToString(), $"%{term}%") ||
                EF.Functions.Like(x.PublicId, $"%{term}%")
            );
        }

        if (!string.IsNullOrEmpty(param.Sort))
        {
            switch (param.Sort)
            {
                case "id":
                    query = param.IsSortAscending
                        ? query.OrderBy(x => x.Id)
                        : query.OrderByDescending(x => x.Id);
                    break;
                case "name":
                    query = param.IsSortAscending
                        ? query.OrderBy(x => x.Name)
                        : query.OrderByDescending(x => x.Name);
                    break;
                default:
                    query = query.OrderByDescending(x => x.CreatedAt);
                    break;
            }
        }

        return await PagedList<PhotoDto>.CreateAsync(
            query.AsNoTracking().ProjectTo<PhotoDto>(mapper.ConfigurationProvider),
            param.PageNumber, param.PageSize);
    }
}
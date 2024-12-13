using MainService.Core.DTOs;
using MainService.Core.Helpers.Pagination;
using MainService.Core.Helpers.Params;
using MainService.Models.Entities;

namespace MainService.Core.Interfaces.Data;
public interface IPhotoRepository
{
    void Add(Photo item);
    void Delete(Photo item);
    Task<Photo?> GetByIdAsync(int id);
    Task<Photo?> GetByUserIdAsync(int userId);
    Task<PhotoDto?> GetDtoByIdAsync(int id);
    Task<List<PhotoDto>> GetAllDtoAsync();
    Task<List<Photo>> GetAllAsync();
    Task<PagedList<PhotoDto>> GetPagedListAsync(PhotoParams param);
}
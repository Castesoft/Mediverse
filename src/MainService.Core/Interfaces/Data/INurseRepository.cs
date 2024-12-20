using System.Security.Claims;
using MainService.Core.DTOs.Nurses;
using MainService.Core.Helpers.Pagination;
using MainService.Core.Helpers.Params;
using MainService.Models.Entities.Aggregate;

namespace MainService.Core.Interfaces.Data;
public interface INurseRepository
{
    Task<NurseDto?> GetDtoByIdAsync(int id);
    Task<bool> ExistsAsync(int id, int doctorId);
    Task<List<NurseDto>> GetAllDtoAsync(NurseParams param);
    Task<PagedList<NurseDto>> GetPagedListAsync(NurseParams param);
    Task<List<OptionDto>> GetOptionsAsync(NurseParams param);
}
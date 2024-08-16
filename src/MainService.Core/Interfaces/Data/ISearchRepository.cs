using MainService.Core.DTOs.Search;
using MainService.Core.Helpers.Pagination;
using MainService.Core.Helpers.Params;

namespace MainService.Core.Interfaces.Data
{
    public interface ISearchRepository
    {
        Task<PagedList<DoctorSearchResultDto>> GetPagedListAsync(SearchParams param);
    }
}
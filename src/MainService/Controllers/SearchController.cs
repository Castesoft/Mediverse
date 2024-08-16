
using MainService.Core.DTOs.Search;
using MainService.Core.Helpers.Pagination;
using MainService.Core.Helpers.Params;
using MainService.Core.Interfaces.Services;
using MainService.Extensions;
using Microsoft.AspNetCore.Mvc;

namespace MainService.Controllers;

public class SearchController(IUnitOfWork uow, IUsersService usersService
// ,IMapper mapper, 
// UserManager<AppUser> userManager
) : BaseApiController
{
    [HttpGet]
    public async Task<ActionResult<DoctorSearchResultsDto>> GetPagedListAsync([FromQuery] SearchParams param)
    {
        var pagedList = await uow.SearchRepository.GetPagedListAsync(param);

        Response.AddPaginationHeader(new PaginationHeader(pagedList.CurrentPage, pagedList.PageSize,
            pagedList.TotalCount, pagedList.TotalPages));

        if (param.Latitude == null || param.Longitude == null)
        {
            return new DoctorSearchResultsDto
            {
                Doctors = pagedList,
            };
        }
        else
        {
            return new DoctorSearchResultsDto
            {
                Doctors = pagedList,
                Latitude = (double)param.Latitude,
                Longitude = (double)param.Longitude,
            };
        }
    }

    [HttpGet("fields")]
    public async Task<ActionResult<SearchFieldsDto>> GetSearchFieldsAsync()
    {
        var item = new SearchFieldsDto
        {
            SpecialistsQuantity = await usersService.GetSpecialistsQuantityAsync(),
            Specialties = await usersService.GetSpecialtiesAsync(),
        };

        return item;
    }
}

using MainService.Core.DTOs.Search;
using MainService.Core.Interfaces.Services;
using Microsoft.AspNetCore.Mvc;

namespace MainService.Controllers;

public class SearchController(IUnitOfWork uow, IUsersService usersService
// ,IMapper mapper, 
// UserManager<AppUser> userManager
) : BaseApiController
{

    [HttpGet]
    public async Task<ActionResult<SearchFieldsDto>> GetSearchFieldsAsync()
    {
        var item = new SearchFieldsDto
        {
            Specialties = await usersService.GetSpecialtiesAsync(),
        };

        return item;
    }
    // [HttpGet]
    // public async Task<ActionResult<>> GetLocationSuggestionsAsync()
    // {
        
    // }
    // [HttpGet]
    // public async Task<ActionResult<>> GetPagedListAsync([FromQuery] SearchParams param)
    // {
        
    // }
}
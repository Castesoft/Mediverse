using MainService.Core.Extensions;
using MainService.Core.Helpers.Params;
using MainService.Core.Interfaces.Services;
using MainService.Models.Entities.Aggregate;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace MainService.Controllers
{
    [Authorize]
    public class PatientsController(IUnitOfWork uow) : BaseApiController
    {
        [HttpGet("options")]
        public async Task<ActionResult<List<OptionDto>>> GetOptionsAsync([FromQuery] UserParams param) {
            int userId = User.GetUserId();

            param.DoctorId = userId;

            return await uow.UserRepository.GetPatientOptionsForDoctorAsync(param);
        }
    }
}
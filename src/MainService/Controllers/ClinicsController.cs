using MainService.Core.Extensions;
using MainService.Core.Helpers.Params;
using MainService.Core.Interfaces.Services;
using MainService.Models.Entities.Aggregate;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace MainService.Controllers
{
    [Authorize]
    public class ClinicsController(IUnitOfWork uow) : BaseApiController
    {
        [HttpGet("options")]
        public async Task<ActionResult<List<OptionDto>>> GetClinicOptionsForDoctorAsync([FromQuery] AddressParams param)
        {
            int userId = User.GetUserId();

            param.DoctorId = userId;

            return await uow.AddressRepository.GetClinicOptionsForDoctorAsync(param);
        }
        
    }
}
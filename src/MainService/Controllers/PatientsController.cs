using MainService.Core.DTOs.Patients;
using MainService.Core.Extensions;
using MainService.Core.Helpers.Pagination;
using MainService.Core.Helpers.Params;
using MainService.Core.Interfaces.Services;
using MainService.Extensions;
using MainService.Models.Entities.Aggregate;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace MainService.Controllers;
[Authorize]
public class PatientsController(IUnitOfWork uow) : BaseApiController
{
    public async Task<ActionResult<PagedList<PatientDto>>> GetPagedListAsync([FromQuery] PatientParams param)
    {
        PagedList<PatientDto> pagedList = await uow.PatientRepository.GetPagedListAsync(param, User);

        foreach (var item in pagedList)
        {
            item.DoctorEvents = item.DoctorEvents.Where(e => e.Doctor != null && e.Doctor.Id == User.GetUserId()).ToList();
            item.DoctorPayments = item.DoctorPayments.Where(p => p.DoctorId == User.GetUserId()).ToList();
        }

        Response.AddPaginationHeader(new PaginationHeader(pagedList.CurrentPage, pagedList.PageSize,
            pagedList.TotalCount, pagedList.TotalPages));

        return pagedList;
    }

    [HttpGet("options")]
    public async Task<ActionResult<List<OptionDto>>> GetOptionsAsync([FromQuery] UserParams param)
    {
        int userId = User.GetUserId();

        param.DoctorId = userId;

        return await uow.UserRepository.GetPatientOptionsForDoctorAsync(param);
    }
}
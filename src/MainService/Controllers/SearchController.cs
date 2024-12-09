using MainService.Core.DTOs.Search;
using MainService.Core.Extensions;
using MainService.Core.Helpers.Pagination;
using MainService.Core.Helpers.Params;
using MainService.Core.Interfaces.Services;
using MainService.Extensions;
using MainService.Models.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace MainService.Controllers;

[AllowAnonymous]
public class SearchController(IUnitOfWork uow, IUsersService usersService, UserManager<AppUser> userManager
// ,IMapper mapper, 
) : BaseApiController
{
    [HttpGet]
    public async Task<ActionResult<DoctorSearchResultsDto>> GetPagedListAsync([FromQuery] SearchParams param)
    {
        var identity = User.Identity;
        
        if (User.Identity != null && User.Identity.IsAuthenticated) {
            AppUser? user = await userManager.GetUserAsync(User);
            if (user != null)
            {
                param.PatientId = user.Id;
            }
        }
        
        PagedList<DoctorSearchResultDto> pagedList = await uow.SearchRepository.GetPagedListAsync(param);

        Response.AddPaginationHeader(new PaginationHeader(pagedList.CurrentPage, pagedList.PageSize,
            pagedList.TotalCount, pagedList.TotalPages));

        foreach (DoctorSearchResultDto doctor in pagedList)
        {
            doctor.AvailableDays = Enumerable.Range(0, 7)
                .Select(i => DateTime.Now.AddDays(i))
                .Select((date, index) => new AvailableDayDto
                {
                    Day = index == 0 ? "Hoy" : System.Globalization.CultureInfo.CurrentCulture.TextInfo.ToTitleCase(date.ToString("dddd", new System.Globalization.CultureInfo("es-ES"))),
                    DayNumber = date.Day,
                    Month = System.Globalization.CultureInfo.CurrentCulture.TextInfo.ToTitleCase(date.ToString("MMMM", new System.Globalization.CultureInfo("es-ES"))),
                    MonthNumber = date.Month,
                    Year = date.Year,
                    AvailableTimes = [.. doctor.WorkSchedules
                        .Where(ws => ws.DayOfWeek == (int)date.DayOfWeek)
                        .Select(ws =>
                        {
                            TimeSpan startTime = ws.StartTime.ToTimeSpan();
                            TimeSpan endTime = ws.EndTime.ToTimeSpan();
                            DateTime localDate = date.Date;
                            Event? conflictingEvent = doctor.DoctorEvents.FirstOrDefault(e =>
                                e.DateFrom.HasValue &&
                                e.DateTo.HasValue &&
                                e.DateFrom.Value.Date == localDate &&
                                e.DateFrom.Value.ToLocalTime().TimeOfDay < endTime &&
                                e.DateTo.Value.ToLocalTime().TimeOfDay > startTime
                            );

                            return new AvailableTimeDto
                            {
                                Start = ws.StartTime.ToString("HH:mm"),
                                End = ws.EndTime.ToString("HH:mm"),
                                Available = conflictingEvent == null
                            };
                        })
                        .Where(ws => TimeSpan.Parse(ws.Start) > DateTime.Now.TimeOfDay || date.Date > DateTime.Today)
                        .OrderBy(ws => ws.Start)]
                })
                .ToList();

            doctor.WorkSchedules = [];
            doctor.DoctorEvents = [];

            doctor.HasPatientInformationAccess = doctor.Patients.Any(p => p.PatientId == param.PatientId && p.HasPatientInformationAccess);
            doctor.Patients = [];
        }

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

    [HttpGet("{id}")]
    public async Task<ActionResult<DoctorSearchResultDto>> GetDoctorByIdAsync(int id)
    {
        var doctor = await uow.SearchRepository.GetDoctorByIdAsync(id);

        doctor.AvailableDays = Enumerable.Range(0, 7)
                .Select(i => DateTime.Now.AddDays(i))
                .Select((date, index) => new AvailableDayDto
                {
                    Day = index == 0 ? "Hoy" : System.Globalization.CultureInfo.CurrentCulture.TextInfo.ToTitleCase(date.ToString("dddd", new System.Globalization.CultureInfo("es-ES"))),
                    DayNumber = date.Day,
                    Month = System.Globalization.CultureInfo.CurrentCulture.TextInfo.ToTitleCase(date.ToString("MMMM", new System.Globalization.CultureInfo("es-ES"))),
                    MonthNumber = date.Month,
                    Year = date.Year,
                    AvailableTimes = [.. doctor.WorkSchedules
                        .Where(ws => ws.DayOfWeek == (int)date.DayOfWeek)
                        .Select(ws =>
                        {
                            TimeSpan startTime = ws.StartTime.ToTimeSpan();
                            TimeSpan endTime = ws.EndTime.ToTimeSpan();
                            DateTime localDate = date.Date;
                            Event? conflictingEvent = doctor.DoctorEvents.FirstOrDefault(e =>
                                e.DateFrom.HasValue &&
                                e.DateTo.HasValue &&
                                e.DateFrom.Value.Date == localDate &&
                                e.DateFrom.Value.ToLocalTime().TimeOfDay < endTime &&
                                e.DateTo.Value.ToLocalTime().TimeOfDay > startTime
                            );

                            return new AvailableTimeDto
                            {
                                Start = ws.StartTime.ToString("HH:mm"),
                                End = ws.EndTime.ToString("HH:mm"),
                                Available = conflictingEvent == null
                            };
                        })
                        .Where(ws => TimeSpan.Parse(ws.Start) > DateTime.Now.TimeOfDay || date.Date > DateTime.Today)
                        .OrderBy(ws => ws.Start)]
                })
                .ToList();

        doctor.WorkSchedules = [];
        doctor.DoctorEvents = [];

        return doctor;
    }

    // [HttpGet("fields")]
    // public async Task<ActionResult<SearchFieldsDto>> GetSearchFieldsAsync()
    // {
    //     var item = new SearchFieldsDto
    //     {
    //         SpecialistsQuantity = await usersService.GetSpecialistsQuantityAsync(),
    //         // Specialties = await usersService.GetSpecialtiesAsync(),
    //     };

    //     return item;
    // }

    [HttpGet("specialists-quantity")]
    public async Task<ActionResult<int>> GetSpecialistsQuantityAsync() =>
        await usersService.GetSpecialistsQuantityAsync();
}
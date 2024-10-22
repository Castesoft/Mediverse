using MainService.Core.DTOs.Search;
using MainService.Core.Helpers.Pagination;
using MainService.Core.Helpers.Params;
using MainService.Core.Interfaces.Services;
using MainService.Extensions;
using MainService.Models.Entities;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace MainService.Controllers;

public class SearchController(IUnitOfWork uow, IUsersService usersService, UserManager<AppUser> userManager
// ,IMapper mapper, 
) : BaseApiController
{
    [HttpGet]
    public async Task<ActionResult<DoctorSearchResultsDto>> GetPagedListAsync([FromQuery] SearchParams param)
    {
        if (User.Identity.IsAuthenticated)
        {
            var user = await userManager.GetUserAsync(User);
            if (user != null)
            {
                param.PatientId = user.Id;
            }
        }

        var pagedList = await uow.SearchRepository.GetPagedListAsync(param);

        Response.AddPaginationHeader(new PaginationHeader(pagedList.CurrentPage, pagedList.PageSize,
            pagedList.TotalCount, pagedList.TotalPages));

        foreach (var doctor in pagedList)
        {
            doctor.DoctorAvailabilities = Enumerable.Range(0, 7)
                .Select(i => DateTime.Now.AddDays(i))
                .Select((date, index) => new DoctorAvailability
                {
                    Day = index == 0 ? "Hoy" : System.Globalization.CultureInfo.CurrentCulture.TextInfo.ToTitleCase(date.ToString("dddd", new System.Globalization.CultureInfo("es-ES"))),
                    DayNumber = date.Day,
                    Month = System.Globalization.CultureInfo.CurrentCulture.TextInfo.ToTitleCase(date.ToString("MMMM", new System.Globalization.CultureInfo("es-ES"))),
                    MonthNumber = date.Month,
                    Year = date.Year,
                    Availability = [.. doctor.WorkSchedules
                        .Where(ws => ws.DayOfWeek == (int)date.DayOfWeek)
                        .Select(ws =>
                        {
                            var startTime = ws.StartTime.ToTimeSpan();
                            var endTime = ws.EndTime.ToTimeSpan();
                            var localDate = date.Date;
                            var conflictingEvent = doctor.DoctorEvents.FirstOrDefault(e =>
                                e.DateFrom.Date == localDate &&
                                e.DateFrom.ToLocalTime().TimeOfDay < endTime &&
                                e.DateTo.ToLocalTime().TimeOfDay > startTime);

                            return new DoctorAvailabilityTime
                            {
                                Start = ws.StartTime.ToString("HH:mm"),
                                End = ws.EndTime.ToString("HH:mm"),
                                Available = conflictingEvent == null
                            };
                        })
                        .Where(ws => TimeSpan.Parse(ws.Start) > DateTime.Now.TimeOfDay || date.Date > DateTime.Today)
                        .OrderBy(ws => ws.Start)]
                })
                .ToArray();

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

        doctor.DoctorAvailabilities = Enumerable.Range(0, 7)
                .Select(i => DateTime.Now.AddDays(i))
                .Select((date, index) => new DoctorAvailability
                {
                    Day = index == 0 ? "Hoy" : System.Globalization.CultureInfo.CurrentCulture.TextInfo.ToTitleCase(date.ToString("dddd", new System.Globalization.CultureInfo("es-ES"))),
                    DayNumber = date.Day,
                    Month = System.Globalization.CultureInfo.CurrentCulture.TextInfo.ToTitleCase(date.ToString("MMMM", new System.Globalization.CultureInfo("es-ES"))),
                    MonthNumber = date.Month,
                    Year = date.Year,
                    Availability = [.. doctor.WorkSchedules
                        .Where(ws => ws.DayOfWeek == (int)date.DayOfWeek)
                        .Select(ws =>
                        {
                            var startTime = ws.StartTime.ToTimeSpan();
                            var endTime = ws.EndTime.ToTimeSpan();
                            var localDate = date.Date;
                            var conflictingEvent = doctor.DoctorEvents.FirstOrDefault(e =>
                                e.DateFrom.Date == localDate &&
                                e.DateFrom.ToLocalTime().TimeOfDay < endTime &&
                                e.DateTo.ToLocalTime().TimeOfDay > startTime);

                            return new DoctorAvailabilityTime
                            {
                                Start = ws.StartTime.ToString("HH:mm"),
                                End = ws.EndTime.ToString("HH:mm"),
                                Available = conflictingEvent == null
                            };
                        })
                        .Where(ws => TimeSpan.Parse(ws.Start) > DateTime.Now.TimeOfDay || date.Date > DateTime.Today)
                        .OrderBy(ws => ws.Start)]
                })
                .ToArray();

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
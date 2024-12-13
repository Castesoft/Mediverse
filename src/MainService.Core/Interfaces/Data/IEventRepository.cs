using System.Security.Claims;
using MainService.Core.DTOs.Events;
using MainService.Core.Helpers.Pagination;
using MainService.Core.Helpers.Params;
using MainService.Models.Entities;

namespace MainService.Core.Interfaces.Data;

public interface IEventRepository
{
    void Add(Event item);
    void Delete(Event item);
    Task<Event?> GetByIdAsync(int id);
    Task<EventDto?> GetDtoByIdAsync(int id);
    Task<Event?> GetByIdAsNoTrackingAsync(int id);
    Task<List<EventSummaryDto>> GetSummaryDtosAsync(EventParams param, ClaimsPrincipal user);
    Task<List<Event>> GetAllAsync();
    Task<List<EventDto>> GetAllDtoAsync(EventParams param);
    Task<PagedList<EventDto>> GetPagedListAsync(EventParams param, ClaimsPrincipal user);
    Task<List<EventDto>> GetAllDtoAsync(EventParams param, ClaimsPrincipal user);
    Task<EventDoctorFieldsDto> GetDoctorFieldsDtoAsync(ClaimsPrincipal user);
    Task<List<Event>> GetPendingSatisfactionSurveysAsync(int userId);
    Task<bool> ExistsByIdAsync(int id);
    /// <summary>
    /// Asynchronously checks if a doctor has a specific event.
    /// </summary>
    /// <param name="doctorId">The unique identifier of the doctor.</param>
    /// <param name="eventId">The unique identifier of the event.</param>
    /// <returns>A task that represents the asynchronous operation. The task result contains a boolean value indicating whether the doctor has the event.</returns>
    Task<bool> DoctorHasEventAsync(int doctorId, int eventId);
}
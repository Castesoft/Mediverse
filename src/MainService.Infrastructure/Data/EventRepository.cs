using System.Security.Claims;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using MainService.Core.DTOs.Events;
using MainService.Core.Extensions;
using MainService.Core.Helpers.Pagination;
using MainService.Core.Helpers.Params;
using MainService.Core.Interfaces.Data;
using MainService.Infrastructure.QueryExtensions;
using MainService.Models;
using MainService.Models.Entities;
using Microsoft.EntityFrameworkCore;
using Serilog;
using DateTime = System.DateTime;

namespace MainService.Infrastructure.Data
{
    /// <summary>
    /// Repository responsible for data operations on Event entities.
    /// </summary>
    public class EventRepository(DataContext context, IMapper mapper) : IEventRepository
    {
        #region Basic CRUD

        public void Add(Event item) => context.Events.Add(item);

        public void Delete(Event item) => context.Events.Remove(item);

        #endregion

        #region Read Operations

        public async Task<List<EventSummaryDto>> GetSummaryDtosAsync(EventParams param)
        {
            var query = context.Events
                .AsNoTracking()
                .Include(x => x.DoctorEvent)
                .Include(x => x.EventService.Service)
                .AsQueryable();

            if (param.ServiceId.HasValue)
                query = query.Where(x => x.EventService.ServiceId == param.ServiceId.Value);

            if (param.DoctorId.HasValue)
                query = query.Where(x => x.DoctorEvent.DoctorId == param.DoctorId.Value);

            query = query.OrderBy(x => x.DateFrom).ThenBy(x => x.DateTo);

            if (!string.IsNullOrEmpty(param.Search))
            {
                var term = param.Search.ToLower();
                query = query.Where(x =>
                    (x.PatientEvent != null &&
                     x.PatientEvent.Patient != null &&
                     !string.IsNullOrEmpty(x.PatientEvent.Patient.FirstName) &&
                     x.PatientEvent.Patient.FirstName.ToLower().Contains(term)) ||
                    (x.PatientEvent != null &&
                     x.PatientEvent.Patient != null &&
                     !string.IsNullOrEmpty(x.PatientEvent.Patient.LastName) &&
                     x.PatientEvent.Patient.LastName.ToLower().Contains(term)) ||
                    (x.EventService != null &&
                     x.EventService.Service != null &&
                     !string.IsNullOrEmpty(x.EventService.Service.Name) &&
                     x.EventService.Service.Name.ToLower().Contains(term)) ||
                    (x.EventClinic != null &&
                     x.EventClinic.Clinic != null &&
                     !string.IsNullOrEmpty(x.EventClinic.Clinic.Name) &&
                     x.EventClinic.Clinic.Name.ToLower().Contains(term)) ||
                    (x.DoctorEvent != null &&
                     x.DoctorEvent.Doctor != null &&
                     !string.IsNullOrEmpty(x.DoctorEvent.Doctor.FirstName) &&
                     x.DoctorEvent.Doctor.FirstName.ToLower().Contains(term)) ||
                    (x.DoctorEvent != null &&
                     x.DoctorEvent.Doctor != null &&
                     !string.IsNullOrEmpty(x.DoctorEvent.Doctor.LastName) &&
                     x.DoctorEvent.Doctor.LastName.ToLower().Contains(term))
                );
            }

            query = query.Take(10);

            return await query
                .ProjectTo<EventSummaryDto>(mapper.ConfigurationProvider)
                .ToListAsync();
        }

        public async Task<List<Event>> GetAllAsync() =>
            await context.Events.ToListAsync();

        public async Task<Event?> GetByIdAsNoTrackingAsync(int id) =>
            await context.Events
                .Includes()
                .AsNoTracking()
                .SingleOrDefaultAsync(x => x.Id == id);

        public async Task<Event?> GetByIdAsync(int id) =>
            await context.Events
                .Includes()
                .SingleOrDefaultAsync(x => x.Id == id);

        public async Task<EventDto?> GetDtoByIdAsync(int id) =>
            await context.Events
                .Includes()
                .AsNoTracking()
                .ProjectTo<EventDto>(mapper.ConfigurationProvider)
                .SingleOrDefaultAsync(x => x.Id == id);

        public async Task<PagedList<EventDto>> GetPagedListAsync(EventParams param)
        {
            var query = context.Events
                .Includes()
                .ApplyFiltering(param)
                .ApplySorting(param);

            return await PagedList<EventDto>.CreateAsync(
                query.AsNoTracking().ProjectTo<EventDto>(mapper.ConfigurationProvider),
                param.PageNumber,
                param.PageSize
            );
        }

        public async Task<List<EventMonthDayCellDto>> GetMonthViewPartialAsync(EventParams param)
        {
            var year = param.Year ?? DateTime.UtcNow.Year;
            var month = param.Month ?? DateTime.UtcNow.Month;
            var maxEvents = param.MaxEventsPerDay ?? 3;
            var startOfMonth = new DateTime(year, month, 1, 0, 0, 0, DateTimeKind.Utc);
            var startOfNextMonth = startOfMonth.AddMonths(1);

            var query = context.Events
                .Includes()
                .AsNoTracking()
                .Where(e => e.DateFrom >= startOfMonth && e.DateFrom < startOfNextMonth);

            if (param.DoctorId.HasValue)
                query = query.Where(x => x.DoctorEvent.DoctorId == param.DoctorId);
            if (param.PatientId.HasValue)
                query = query.Where(x => x.PatientEvent.PatientId == param.PatientId);
            if (param.UserId.HasValue)
            {
                query = query.Where(x =>
                    x.PatientEvent.PatientId == param.UserId ||
                    x.DoctorEvent.DoctorId == param.UserId ||
                    x.NurseEvents.Any(y => y.NurseId == param.UserId)
                );
            }

            var allMonthEvents = await query
                .ProjectTo<EventSummaryDto>(mapper.ConfigurationProvider)
                .ToListAsync();

            var groupedByDay = allMonthEvents
                .Where(x => x.DateFrom.HasValue)
                .GroupBy(e => e.DateFrom.Value.ToUniversalTime().Date)
                .Select(g => new EventMonthDayCellDto
                {
                    Date = g.Key,
                    TotalCount = g.Count(),
                    Events = g.OrderBy(ev => ev.DateFrom)
                        .Take(maxEvents)
                        .ToList()
                })
                .ToList();

            var daysInMonth = new List<EventMonthDayCellDto>();
            for (var date = startOfMonth; date < startOfNextMonth; date = date.AddDays(1))
            {
                var existing = groupedByDay.FirstOrDefault(x => x.Date == date.Date);
                daysInMonth.Add(existing ?? new EventMonthDayCellDto
                {
                    Date = date,
                    Events = new List<EventSummaryDto>(),
                    TotalCount = 0
                });
            }

            return daysInMonth;
        }

        public async Task<List<EventDto>> GetAllDtoAsync(EventParams param)
        {
            var query = context.Events
                .Includes()
                .AsQueryable();

            if (param.DoctorId.HasValue)
                query = query.Where(x => x.DoctorEvent.DoctorId == param.DoctorId);
            if (param.ServiceId.HasValue)
                query = query.Where(x => x.EventService.ServiceId == param.ServiceId.Value);

            return await query
                .AsNoTracking()
                .ProjectTo<EventDto>(mapper.ConfigurationProvider)
                .ToListAsync();
        }

        public async Task<List<Event>> GetPendingSatisfactionSurveysAsync(int userId) =>
            await context.Events
                .Where(x => x.PatientEvent.PatientId == userId &&
                            x.IsSatisfactionSurveyEmailSent == true &&
                            x.IsSatisfactionSurveyCompleted == false)
                .Include(x => x.DoctorEvent)
                .ThenInclude(x => x.Doctor)
                .Include(x => x.EventService)
                .ThenInclude(x => x.Service)
                .ToListAsync();

        public async Task<EventDoctorFieldsDto> GetDoctorFieldsDtoAsync(ClaimsPrincipal user)
        {
            var doctor = await context.Users
                .Where(x => x.Id == user.GetUserId())
                .Include(x => x.DoctorClinics)
                .ThenInclude(x => x.Clinic)
                .SingleOrDefaultAsync();

            return mapper.Map<EventDoctorFieldsDto>(doctor);
        }

        public async Task<bool> DoctorHasEventAsync(int doctorId, int eventId) =>
            await context.Events
                .Include(x => x.DoctorEvent)
                .AnyAsync(x => x.Id == eventId && x.DoctorEvent.DoctorId == doctorId);

        #endregion
    }
}
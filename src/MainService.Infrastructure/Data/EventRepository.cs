using System.Security.Claims;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using MainService.Core.DTOs.Events;
using MainService.Core.Extensions;
using MainService.Core.Helpers.Pagination;
using MainService.Core.Helpers.Params;
using MainService.Core.Interfaces.Data;
using MainService.Models;
using MainService.Models.Entities;
using Microsoft.EntityFrameworkCore;

namespace MainService.Infrastructure.Data;

public class EventRepository(DataContext context, IMapper mapper) : IEventRepository
{
    public void Add(Event item)
    {
        context.Events.Add(item);
    }

    public void Delete(Event item)
    {
        context.Events.Remove(item);
    }

    public async Task<List<EventSummaryDto>> GetSummaryDtosAsync(EventParams param)
    {
        var query = context.Events
            .AsNoTracking()
            .Include(x => x.DoctorEvent)
            .Include(x => x.EventService.Service)
            .AsQueryable();

        if (param.ServiceId.HasValue)
        {
            query = query.Where(x => x.EventService.ServiceId == param.ServiceId.Value);
        }

        if (param.DoctorId.HasValue)
        {
            query = query.Where(x => x.DoctorEvent.DoctorId == param.DoctorId.Value);
        }

        query = query.OrderBy(x => x.DateFrom).ThenBy(x => x.DateTo);

        if (!string.IsNullOrEmpty(param.Search))
        {
            var term = param.Search.ToLower();

            query = query.Where(
                x =>
                    (
                        x.PatientEvent != null &&
                        x.PatientEvent.Patient != null &&
                        !string.IsNullOrEmpty(x.PatientEvent.Patient.FirstName) &&
                        x.PatientEvent.Patient.FirstName.ToLower().Contains(term)
                    ) ||
                    (
                        x.PatientEvent != null &&
                        x.PatientEvent.Patient != null &&
                        !string.IsNullOrEmpty(x.PatientEvent.Patient.LastName) &&
                        x.PatientEvent.Patient.LastName.ToLower().Contains(term)
                    ) ||
                    (
                        x.EventService != null &&
                        x.EventService.Service != null &&
                        !string.IsNullOrEmpty(x.EventService.Service.Name) &&
                        x.EventService.Service.Name.ToLower().Contains(term)
                    ) ||
                    (
                        x.EventClinic != null &&
                        x.EventClinic.Clinic != null &&
                        !string.IsNullOrEmpty(x.EventClinic.Clinic.Name) &&
                        x.EventClinic.Clinic.Name.ToLower().Contains(term)
                    ) ||
                    (
                        x.DoctorEvent != null &&
                        x.DoctorEvent.Doctor != null &&
                        !string.IsNullOrEmpty(x.DoctorEvent.Doctor.FirstName) &&
                        x.DoctorEvent.Doctor.FirstName.ToLower().Contains(term)
                    ) ||
                    (
                        x.DoctorEvent != null &&
                        x.DoctorEvent.Doctor != null &&
                        !string.IsNullOrEmpty(x.DoctorEvent.Doctor.LastName) &&
                        x.DoctorEvent.Doctor.LastName.ToLower().Contains(term)
                    )
            );
        }

        query = query.Take(10);

        return await query.ProjectTo<EventSummaryDto>(mapper.ConfigurationProvider)
            .ToListAsync();
    }

    public async Task<List<Event>> GetAllAsync()
    {
        return await context.Events.ToListAsync();
    }

    public async Task<Event?> GetByIdAsNoTrackingAsync(int id) =>
        await context.Events
            .AsNoTracking()
            .SingleOrDefaultAsync(x => x.Id == id);

    public async Task<Event?> GetByIdAsync(int id) =>
        await context.Events
            .Include(x => x.PatientEvent.Patient.UserPhoto.Photo)
            .Include(x => x.DoctorEvent)
            .ThenInclude(x => x.Doctor)
            .SingleOrDefaultAsync(x => x.Id == id);

    public async Task<EventDto?> GetDtoByIdAsync(int id) =>
        await context.Events
            .AsNoTracking()
            .ProjectTo<EventDto>(mapper.ConfigurationProvider)
            .SingleOrDefaultAsync(x => x.Id == id);

    public async Task<PagedList<EventDto>> GetPagedListAsync(EventParams param)
    {
        var query = context.Events
            .Include(x => x.EventService)
            .Include(x => x.EventClinic)
            .Include(x => x.DoctorEvent)
            .Include(x => x.PatientEvent)
            .Include(x => x.PatientEvent.Patient.UserPhoto.Photo)
            .Include(x => x.NurseEvents)
            .Include(x => x.EventPrescriptions).ThenInclude(x => x.Prescription)
            .Include(x => x.EventPaymentMethodType)
            .Include(x => x.EventMedicalInsuranceCompany)
            .Include(x => x.Payments)
            .AsQueryable();

        if (param.DoctorId.HasValue)
        {
            query = query.Where(x => x.DoctorEvent.DoctorId == param.DoctorId);
        }

        if (param.PatientId.HasValue)
        {
            query = query.Where(x => x.PatientEvent.PatientId == param.PatientId);
        }

        if (param.ServiceId.HasValue)
        {
            query = query.Where(x => x.EventService.ServiceId == param.ServiceId.Value);
        }

        if (param.NurseId.HasValue)
        {
            query = query.Where(x => x.NurseEvents.Any(y => y.NurseId == param.NurseId));
        }

        if (param.UserId.HasValue)
        {
            query = query.Where(x =>
                x.PatientEvent.PatientId == param.UserId ||
                x.DoctorEvent.DoctorId == param.UserId ||
                x.NurseEvents.Any(y => y.NurseId == param.UserId
                ));
        }

        if (!string.IsNullOrEmpty(param.Patients))
        {
            var patients = param.GetPatients();

            if (patients.Count != 0)
            {
                query = query.Where(x => x.PatientEvent != null && patients.Contains(x.PatientEvent.PatientId));
            }
        }

        if (!string.IsNullOrEmpty(param.Services))
        {
            var services = param.GetServices();

            if (services.Count != 0)
            {
                query = query.Where(x => services.Contains(x.EventService.ServiceId));
            }
        }

        if (!string.IsNullOrEmpty(param.Nurses))
        {
            var nurses = param.GetNurses();

            if (nurses.Count != 0)
            {
                query = query.Where(x => x.NurseEvents.Any(y => nurses.Contains(y.NurseId)));
            }
        }

        return await PagedList<EventDto>.CreateAsync(
            query.AsNoTracking().ProjectTo<EventDto>(mapper.ConfigurationProvider),
            param.PageNumber,
            param.PageSize
        );
    }

    public async Task<List<EventDto>> GetAllDtoAsync(EventParams param)
    {
        var query = context.Events
            .Include(x => x.EventService)
            .Include(x => x.EventClinic)
            .Include(x => x.DoctorEvent)
            .Include(x => x.PatientEvent.Patient.UserPhoto.Photo)
            .Include(x => x.NurseEvents)
            .Include(x => x.EventPrescriptions)
            .ThenInclude(x => x.Prescription)
            .Include(x => x.EventPaymentMethodType)
            .Include(x => x.EventMedicalInsuranceCompany)
            .Include(x => x.Payments)
            .AsQueryable();

        if (param.DoctorId.HasValue)
        {
            query = query.Where(x => x.DoctorEvent.DoctorId == param.DoctorId);
        }

        if (param.ServiceId.HasValue)
        {
            query = query.Where(x => x.EventService.ServiceId == param.ServiceId.Value);
        }

        return await query.AsNoTracking().ProjectTo<EventDto>(mapper.ConfigurationProvider).ToListAsync();
    }

    public async Task<List<Event>> GetPendingSatisfactionSurveysAsync(int userId)
    {
        return await context.Events
            .Where(x => x.PatientEvent.PatientId == userId && x.IsSatisfactionSurveyEmailSent == true &&
                        x.IsSatisfactionSurveyCompleted == false)
            .Include(x => x.DoctorEvent)
            .ThenInclude(x => x.Doctor)
            .Include(x => x.EventService)
            .ThenInclude(x => x.Service)
            .ToListAsync();
    }

    public async Task<EventDoctorFieldsDto> GetDoctorFieldsDtoAsync(ClaimsPrincipal user)
    {
        var doctor = await context.Users
            .Where(x => x.Id == user.GetUserId())
            .Include(x => x.DoctorClinics)
            .ThenInclude(x => x.Clinic)
            .SingleOrDefaultAsync();

        return mapper.Map<EventDoctorFieldsDto>(doctor);
    }

    public async Task<bool> ExistsByIdAsync(int id) => await context.Events.AnyAsync(x => x.Id == id);

    public async Task<bool> DoctorHasEventAsync(int doctorId, int eventId) =>
        await context.Events
            .Include(x => x.DoctorEvent)
            .AnyAsync(x => x.Id == eventId && x.DoctorEvent.DoctorId == doctorId);
}
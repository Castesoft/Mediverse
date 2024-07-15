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

    public async Task<List<Event>> GetAllAsync()
    {
        return await context.Events.ToListAsync();
    }

    public async Task<List<EventDto>> GetAllDtoAsync(EventParams param)
    {
        // TODO: filtering after

        var query = context.Events
            .AsNoTracking()
            .ProjectTo<EventDto>(mapper.ConfigurationProvider);

        return await query.ToListAsync();
    }

    public async Task<Event> GetByIdAsNoTrackingAsync(int id)
    {
        var item = await context.Events
            .AsNoTracking()
            .SingleOrDefaultAsync(x => x.Id == id);

        return item;
    }

    public async Task<Event> GetByIdAsync(int id)
    {
        var item = await context.Events
            .SingleOrDefaultAsync(x => x.Id == id);

        return item;
    }

    public async Task<EventDto> GetDtoByIdAsync(int id)
    {
        var item = await context.Events
            .AsNoTracking()
            .ProjectTo<EventDto>(mapper.ConfigurationProvider)
            .SingleOrDefaultAsync(x => x.Id == id);

        return item;
    }

    public async Task<PagedList<EventDto>> GetPagedListAsync(EventParams param, ClaimsPrincipal user)
    {
        var query = context.Events
            .Include(x => x.EventService)
            .Include(x => x.EventClinic)
            .Include(x => x.DoctorEvent)
            .Include(x => x.PatientEvent)
            .Include(x => x.NurseEvents)
            .Include(x => x.EventPrescriptions)
            .AsQueryable();

        if (param.DateFrom != DateTime.MinValue)
            query = query.Where(x => x.CreatedAt >= param.DateFrom);

        if (param.DateTo != DateTime.MaxValue)
            query = query.Where(x => x.CreatedAt <= param.DateTo);

        IEnumerable<string> roles = user.GetRoles();

        switch (param.Role)
        {
            case Roles.Admin:
                if (!roles.Contains("Admin")) return null;
                break;
            case Roles.Doctor:
                if (!roles.Contains("Admin") || !roles.Contains("Patient")) return null;
                break;
            case Roles.Patient:
                if (!roles.Contains("Doctor") && !roles.Contains("Nurse")) return null;
                if (roles.Contains("Doctor"))
                {
                    query = query.Where(x => x.DoctorEvent.DoctorId == user.GetUserId());
                }

                break;
            case Roles.Nurse:
                if (!roles.Contains("Doctor")) return null;
                if (roles.Contains("Doctor"))
                {
                    query = query.Where(x => x.DoctorEvent.DoctorId == user.GetUserId());
                }

                break;
            case Roles.Staff:
                if (!roles.Contains("Admin")) return null;
                break;
            default:
                break;
        }


        return await PagedList<EventDto>.CreateAsync(
            query.AsNoTracking().ProjectTo<EventDto>(mapper.ConfigurationProvider),
            param.PageNumber, param.PageSize);
    }
}
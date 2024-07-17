using System.Globalization;
using AngleSharp.Text;
using MainService.Core.DTOs;
using MainService.Core.DTOs.Services;
using MainService.Core.Helpers.Pagination;
using MainService.Core.Helpers.Params;
using MainService.Core.Interfaces.Services;
using MainService.Core.Extensions;
using MainService.Extensions;
using MainService.Models.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using AutoMapper;
using MainService.Core.DTOs.Events;
using Serilog;

namespace MainService.Controllers;

[Authorize]
public class EventsController(IUnitOfWork uow, IEventsService service, UserManager<AppUser> userManager, IMapper mapper)
    : BaseApiController
{
    private static readonly string subject = "cita";
    private static readonly string subjectArticle = "La";


    public async Task<ActionResult<PagedList<EventDto>>> GetPagedListAsync([FromQuery] EventParams param)
    {
        var pagedList = await uow.EventRepository.GetPagedListAsync(param, User);
        
        if (pagedList == null) return NotFound($"{subjectArticle} {subject} no fue encontrada.");
    
        Response.AddPaginationHeader(new PaginationHeader(pagedList.CurrentPage, pagedList.PageSize,
            pagedList.TotalCount, pagedList.TotalPages));
    
        return pagedList;
    }
    
    // [AllowAnonymous]
    // [HttpGet("all")]
    // public async Task<ActionResult<List<EventDto>>> GetAllAsync([FromQuery] EventParams param)
    // {
    //
    //     return data;
    // }

    [HttpGet("{id}")]
    public async Task<ActionResult<EventDto>> GetByIdAsync([FromRoute] int id)
    {
        var item = await uow.EventRepository.GetDtoByIdAsync(id);

        if (item == null) return NotFound($"{subjectArticle} {subject} de ID {id} no fue encontrado.");

        return item;
    }

    // // [Authorize(Policy = "RequireAdminRole")]
    // [HttpDelete("{id}")]
    // public async Task<ActionResult> DeleteByIdAsync(int id)
    // {
    //     var item = await uow.EventRepository.GetByIdAsNoTrackingAsync(id);
    //
    //     if (item == null) return NotFound($"{subjectArticle} {subject} de ID {id} no fue encontrado.");
    //
    //     var deleteResult = await service.DeleteAsync(item);
    //
    //     if (!deleteResult) return BadRequest($"Error al eliminar {subject} de {item.Name}.");
    //
    //     return Ok();
    // }

    [HttpDelete("range/{ids}")]
    public async Task<ActionResult> DeleteRangeAsync([FromRoute] string ids)
    {
        var selectedIds = ids.Split(',').Select(int.Parse).ToList();

        foreach (var item in selectedIds)
        {
            var itemToDelete = await uow.EventRepository.GetByIdAsNoTrackingAsync(item);

            if (itemToDelete == null) return NotFound($"{subjectArticle} {subject} de ID {item} no fue encontrado.");

            var deleteResult = await service.DeleteAsync(itemToDelete);
        }

        return Ok();
    }

    [HttpPost]
    public async Task<ActionResult<EventDto>> CreateAsync([FromBody] EventCreateDto request)
    {
        // TODO: que cuando el rol del usuario de la peticion, cuando este es nurse, obtener el ID del doctor para 
        // la propiedad de Event de DoctorEvent

        IEnumerable<int> nurseIds = request.NursesIds.Split(',')
            .Select(s => int.TryParse(s, out var n) ? n : (int?)null)
            .Where(n => n.HasValue)
            .Select(n => n.Value);
        
        if (!await uow.UserRepository.PatientExistsAsync(request.PatientId, User))
            return BadRequest(
                $"Paciente de ID {request.PatientId} no fue encontrado o no existe para el doctor actual.");

        if (!await uow.AddressRepository.ClinicExistsAsync(request.ClinicId, User))
            return BadRequest(
                $"Clinica de ID {request.PatientId} no fue encontrado o no existe para el doctor actual.");

        if (!await uow.ServiceRepository.ExistsAsync(request.ServiceId, User))
            return BadRequest(
                $"Tratamiento de ID {request.ServiceId} no fue encontrado o no existe para el doctor actual.");

        foreach (var nurseId in nurseIds)
        {
            if (!await uow.UserRepository.NurseExistsAsync(nurseId, User))
                return BadRequest($"Especialista de ID {nurseId} no fue encontrado o no existe para el doctor actual.");
        }

        Event item = new(request.AllDay, request.DateFrom, request.DateTo, request.TimeFrom, request.TimeTo)
        {
            NurseEvents = nurseIds.Select(x => new NurseEvent(x)).ToList(),
            EventService = new(request.ServiceId),
            PatientEvent = new(request.PatientId),
            EventClinic = new(request.ClinicId),
            DoctorEvent = new(User.GetUserId())
        };

        uow.EventRepository.Add(item);

        if (!await uow.Complete()) return BadRequest($"Error al crear {subject}.");

        var itemDto = await uow.EventRepository.GetDtoByIdAsync(item.Id);

        return itemDto;
    }
}
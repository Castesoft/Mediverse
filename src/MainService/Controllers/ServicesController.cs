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

namespace MainService.Controllers;
[Authorize]
public class ServicesController(IUnitOfWork uow, IServicesService service, UserManager<AppUser> userManager, IMapper mapper) : BaseApiController
{
    private static readonly string subject = "servicio";
    private static readonly string subjectArticle = "El";

        
    // [Authorize(Policy = "RequireAdminRole")]
    public async Task<ActionResult<PagedList<ServiceDto>>> GetPagedListAsync([FromQuery] ServiceParams param)
    {
        var pagedList = await uow.ServiceRepository.GetPagedListAsync(param, User);

        Response.AddPaginationHeader(new PaginationHeader(pagedList.CurrentPage, pagedList.PageSize,
            pagedList.TotalCount, pagedList.TotalPages));

        return pagedList;
    }

    [AllowAnonymous]
    [HttpGet("all")]
    public async Task<ActionResult<List<ServiceDto>>> GetAllAsync([FromQuery] ServiceParams param)
    {
        var data = await uow.ServiceRepository.GetAllDtoAsync(param, User);
        
        return data;
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<ServiceDto>> GetByIdAsync([FromRoute]int id)
    {
        var item = await uow.ServiceRepository.GetDtoByIdAsync(id);

        if (item == null) return NotFound($"{subjectArticle} {subject} de ID {id} no fue encontrado.");

        return item;
    }

    // [Authorize(Policy = "RequireAdminRole")]
    [HttpDelete("{id}")]
    public async Task<ActionResult> DeleteByIdAsync(int id)
    {
        var item = await uow.ServiceRepository.GetByIdAsNoTrackingAsync(id);

        if (item == null) return NotFound($"{subjectArticle} {subject} de ID {id} no fue encontrado.");

        var deleteResult = await service.DeleteAsync(item);

        if (!deleteResult) return BadRequest($"Error al eliminar {subject} de {item.Name}.");

        return Ok();
    }

    [HttpDelete("range/{ids}")]
    public async Task<ActionResult> DeleteRangeAsync([FromRoute]string ids)
    {   
        var selectedIds = ids.Split(',').Select(int.Parse).ToList();

        foreach (var item in selectedIds)
        {
            var itemToDelete = await uow.ServiceRepository.GetByIdAsNoTrackingAsync(item);

            if (itemToDelete == null) return NotFound($"{subjectArticle} {subject} de ID {item} no fue encontrado.");

            var deleteResult = await service.DeleteAsync(itemToDelete);

            if (!deleteResult) return BadRequest($"Error al eliminar {subject} de {itemToDelete.Name}.");
        }
        
        return Ok();
    }

    [HttpPost]
    public async Task<ActionResult<ServiceDto>> CreateAsync([FromBody] ServiceCreateDto request)
    {
        var itemExists = await uow.ServiceRepository.GetByNameAsync(request.Name, User);

        if (itemExists != null) 
        return BadRequest($"{subjectArticle} {subject} de nombre '{request.Name}' ya existe para los servicios que ofreces.");

        var doctor = await userManager.Users
            .Include(x => x.DoctorServices)
                .ThenInclude(x => x.Service)
            .SingleOrDefaultAsync(x => x.Id == User.GetUserId());

        var item = mapper.Map<Service>(request);

        doctor.DoctorServices.Add(new(item));

        await userManager.UpdateAsync(doctor);

        var itemToReturn = await uow.ServiceRepository.GetDtoByIdAsync(item.Id);

        return itemToReturn;
    }
}

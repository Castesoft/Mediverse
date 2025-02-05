using MainService.Core.DTOs.Addresses;
using MainService.Core.Helpers.Pagination;
using MainService.Core.Helpers.Params;
using MainService.Core.Interfaces.Services;
using MainService.Extensions;
using MainService.Models.Entities.Aggregate;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace MainService.Controllers;

[Authorize]
public class AddressesController(IUnitOfWork uow, IAddressesService service) : BaseApiController
{
    private static readonly string subject = "dirección";
    private static readonly string subjectArticle = "La";

    public async Task<ActionResult<PagedList<AddressDto>>> GetPagedListAsync([FromQuery] AddressParams param)
    {
        var pagedList = await uow.AddressRepository.GetPagedListAsync(param, User);

        Response.AddPaginationHeader(new PaginationHeader(pagedList.CurrentPage, pagedList.PageSize,
            pagedList.TotalCount, pagedList.TotalPages));

        return pagedList;
    }

    [AllowAnonymous]
    [HttpGet("all")]
    public async Task<ActionResult<List<AddressDto>>> GetAllAsync([FromQuery] AddressParams param)
    {
        var data = await uow.AddressRepository.GetAllDtoAsync(param);
        
        return data;
    }

    [HttpGet("{id:int}")]
    public async Task<ActionResult<AddressDto?>> GetByIdAsync([FromRoute]int id)
    {
        var item = await uow.AddressRepository.GetDtoByIdAsync(id);

        if (item == null) return NotFound($"{subjectArticle} {subject} de ID {id} no fue encontrado.");

        return item;
    }
    
    [HttpGet("options")]
    public async Task<ActionResult<List<OptionDto>>> GetOptionsAsync([FromQuery] AddressParams param)
    {
        var data = await uow.AddressRepository.GetOptionsAsync(param);
        
        return data;
    }

    // [Authorize(Policy = "RequireAdminRole")]
    [HttpDelete("{id:int}")]
    public async Task<ActionResult> DeleteByIdAsync(int id)
    {
        var item = await uow.AddressRepository.GetByIdAsNoTrackingAsync(id);

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
            var itemToDelete = await uow.AddressRepository.GetByIdAsNoTrackingAsync(item);

            if (itemToDelete == null) return NotFound($"{subjectArticle} {subject} de ID {item} no fue encontrado.");

            var deleteResult = await service.DeleteAsync(itemToDelete);

            if (!deleteResult) return BadRequest($"Error al eliminar {subject} de {itemToDelete.Name}.");
        }
        
        return Ok();
    }

    [AllowAnonymous]
    [HttpGet("zipcodes/{zipcode}")]
    public async Task<ActionResult<List<ZipcodeAddressOption>>> GetZipcodeAddressOptionsAsync([FromRoute]string zipcode) =>
        await service.GetZipcodeAddressOptionsAsync(zipcode);
}

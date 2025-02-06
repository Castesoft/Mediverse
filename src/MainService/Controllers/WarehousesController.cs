using AutoMapper;
using MainService.Core.DTOs.Warehouses;
using MainService.Core.Helpers.Pagination;
using MainService.Core.Helpers.Params;
using MainService.Core.Interfaces.Services;
using MainService.Extensions;
using MainService.Models.Entities.Aggregate;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace MainService.Controllers;

[Authorize]
public class WarehousesController(IUnitOfWork uow, IMapper mapper, IWarehousesService service) : BaseApiController
{
    private static readonly string subject = "dirección";
    private static readonly string subjectArticle = "La";

    public async Task<ActionResult<PagedList<WarehouseDto>>> GetPagedListAsync([FromQuery] WarehouseParams param)
    {
        var pagedList = await uow.WarehouseRepository.GetPagedListAsync(param, User);

        Response.AddPaginationHeader(new PaginationHeader(pagedList.CurrentPage, pagedList.PageSize,
            pagedList.TotalCount, pagedList.TotalPages));

        return pagedList;
    }

    [AllowAnonymous]
    [HttpGet("all")]
    public async Task<ActionResult<List<WarehouseDto>>> GetAllAsync([FromQuery] WarehouseParams param)
    {
        var data = await uow.WarehouseRepository.GetAllDtoAsync(param);

        return data;
    }

    [HttpGet("{id:int}")]
    public async Task<ActionResult<WarehouseDto?>> GetByIdAsync([FromRoute] int id)
    {
        var item = await uow.WarehouseRepository.GetDtoByIdAsync(id);

        if (item == null) return NotFound($"{subjectArticle} {subject} de ID {id} no fue encontrado.");

        return item;
    }

    // [Authorize(Policy = "RequireAdminRole")]
    [HttpDelete("{id:int}")]
    public async Task<ActionResult> DeleteByIdAsync(int id)
    {
        var item = await uow.WarehouseRepository.GetByIdAsNoTrackingAsync(id);

        if (item == null) return NotFound($"{subjectArticle} {subject} de ID {id} no fue encontrado.");

        var deleteResult = await service.DeleteAsync(item);

        if (!deleteResult) return BadRequest($"Error al eliminar {subject} de {item.Name}.");

        return Ok();
    }

    [HttpDelete("range/{ids}")]
    public async Task<ActionResult> DeleteRangeAsync([FromRoute] string ids)
    {
        var selectedIds = ids.Split(',').Select(int.Parse).ToList();

        foreach (var item in selectedIds)
        {
            var itemToDelete = await uow.WarehouseRepository.GetByIdAsNoTrackingAsync(item);

            if (itemToDelete == null) return NotFound($"{subjectArticle} {subject} de ID {item} no fue encontrado.");

            var deleteResult = await service.DeleteAsync(itemToDelete);

            if (!deleteResult) return BadRequest($"Error al eliminar {subject} de {itemToDelete.Name}.");
        }

        return Ok();
    }
    
    [HttpGet("options")]
    public async Task<ActionResult<List<OptionDto>>> GetOptionsAsync([FromQuery] WarehouseParams param)
    {
        var data = await uow.WarehouseRepository.GetOptionsAsync(param);
        
        return data;
    }

    [HttpPut("update-products/{id:int}")]
    public async Task<ActionResult<WarehouseDto>> UpdateWarehouseProducts(int id,
        [FromBody] WarehouseUpdateDto updateDto)
    {
        var warehouse = await uow.WarehouseRepository.GetByIdAsync(id);
        if (warehouse == null)
            return NotFound($"Warehouse with ID {id} not found.");

        foreach (var wpDto in updateDto.WarehouseProducts)
        {
            var wp = warehouse.WarehouseProducts.FirstOrDefault(x => x.ProductId == wpDto.ProductId);
            if (wp == null) continue;

            // Compare each field to see if there is any change
            var hasChanged = wp.Quantity != wpDto.Quantity ||
                             wp.ReservedQuantity != wpDto.ReservedQuantity ||
                             wp.DamagedQuantity != wpDto.DamagedQuantity ||
                             wp.OnHoldQuantity != wpDto.OnHoldQuantity ||
                             wp.ReorderLevel != wpDto.ReorderLevel ||
                             wp.SafetyStock != wpDto.SafetyStock ||
                             wp.LotNumber != wpDto.LotNumber ||
                             wp.ExpirationDate != wpDto.ExpirationDate;

            if (!hasChanged) continue;

            wp.Quantity = wpDto.Quantity;
            wp.ReservedQuantity = wpDto.ReservedQuantity;
            wp.DamagedQuantity = wpDto.DamagedQuantity;
            wp.OnHoldQuantity = wpDto.OnHoldQuantity;
            wp.ReorderLevel = wpDto.ReorderLevel;
            wp.SafetyStock = wpDto.SafetyStock;
            wp.LotNumber = wpDto.LotNumber;
            wp.ExpirationDate = wpDto.ExpirationDate?.ToUniversalTime();
            wp.LastUpdated = DateTime.UtcNow;
        }

        await uow.Complete();

        var updatedDto = mapper.Map<WarehouseDto>(warehouse);
        return Ok(updatedDto);
    }
}
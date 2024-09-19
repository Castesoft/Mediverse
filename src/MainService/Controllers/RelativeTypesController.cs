using OfficeOpenXml;
using Microsoft.AspNetCore.Mvc;
using AutoMapper;
using MainService.Extensions;
using MainService.Core.Helpers.Pagination;
using MainService.Core.DTOs;
using MainService.Core.Interfaces.Services;
using MainService.Models.Entities.Aggregate;
using MainService.Models.Entities;

namespace MainService.Controllers;

public class RelativeTypesController(IUnitOfWork uow, IMapper mapper, IRelativeTypesService service) : BaseApiController
{
    private static readonly string EntityName = "tipo de familiar";
    
    [HttpGet]
    public async Task<ActionResult<PagedList<RelativeTypeDto>>> GetPagedListAsync([FromQuery] RelativeTypeParams param)
    {
        var pagedList = await uow.RelativeTypeRepository.GetPagedListAsync(param);

        Response.AddPaginationHeader(
            new PaginationHeader(
                pagedList.CurrentPage,
                pagedList.PageSize,
                pagedList.TotalCount,
                pagedList.TotalPages
            )
        );

        return pagedList;
    }

    [HttpPut("toggleVisibility/{id}")]
    public async Task<ActionResult<RelativeTypeDto>> ToggleVisibilityAsync([FromRoute] int id)
    {
        var item = await uow.RelativeTypeRepository.GetByIdAsync(id);

        if (item == null) return NotFound($"{EntityName} con ID {id} no encontrado.");

        item.Visible = !item.Visible;

        if (!await uow.Complete()) return BadRequest($"Error al cambiar la visibilidad de {EntityName} con ID {id}.");

        return await uow.RelativeTypeRepository.GetDtoByIdAsync(id);
    }

    [HttpGet("options")]
    public async Task<ActionResult<List<OptionDto>>> GetOptionDtosAsync() =>
        await uow.RelativeTypeRepository.GetOptionsAsync();

    [HttpGet("all")]
    public async Task<ActionResult<List<RelativeTypeDto>>> GetAllAsync()
    {
        var data = await uow.RelativeTypeRepository.GetAllAsNoTrackingAsync();

        if (data.Count == 0) return NoContent();

        return data;
    }

    [HttpGet("nameexists")]
    public async Task<ActionResult<bool>> CheckNameExistsAsync([FromQuery] string name, [FromQuery] int? id)
    {
        var item = await uow.RelativeTypeRepository.FindDtoByNameAsync(name);

        if (item == null)
        {
            return false;
        }

        return !id.HasValue || item.Id != id.Value;
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<RelativeTypeDto>> GetByIdAsync([FromRoute] int id)
    {
        if (!await uow.RelativeTypeRepository.ExistsByIdAsync(id))
            return BadRequest($"{EntityName} con ID {id} no existe.");

        return await uow.RelativeTypeRepository.GetDtoByIdAsync(id);
    }

    [HttpPost]
    public async Task<ActionResult<RelativeTypeDto>> AddAsync([FromBody] RelativeTypeCreateDto request)
    {
        if (!await uow.RelativeTypeRepository.NameUniqueAsync(request.Name))
            return BadRequest($"El nombre {request.Name} ya existe.");

        if (!await uow.RelativeTypeRepository.CodeUniqueAsync(request.Code))
            return BadRequest($"El código {request.Code} ya existe.");

        RelativeType itemToAdd = new();

        mapper.Map<RelativeTypeCreateDto, RelativeType>(request, itemToAdd);

        uow.RelativeTypeRepository.Add(itemToAdd);

        if (!await uow.Complete()) return BadRequest($"Error al agregar {EntityName}.");

        return await uow.RelativeTypeRepository.GetDtoByIdAsync(itemToAdd.Id);
    }

    [HttpPut("{id}")]
    public async Task<ActionResult<RelativeTypeDto>> UpdateAsync(
        [FromRoute] int id, 
        [FromBody] RelativeTypeUpdateDto request
    )
    {
        var itemToUpdate = await uow.RelativeTypeRepository.GetByIdAsync(id);

        if (itemToUpdate == null) return NotFound($"{EntityName} con ID {id} no encontrado.");

        mapper.Map<RelativeTypeUpdateDto, RelativeType>(request, itemToUpdate);

        if (!await uow.Complete()) return BadRequest($"Error al actualizar {EntityName} con ID {id}.");

        return await uow.RelativeTypeRepository.GetDtoByIdAsync(id);
    }

    [HttpDelete("{id}")]
    public async Task<ActionResult> DeleteByIdAsync([FromRoute] int id)
    {
        if (!await uow.RelativeTypeRepository.ExistsByIdAsync(id))
            return BadRequest($"{EntityName} con ID {id} no existe.");

        if (!await service.DeleteByIdAsync(id)) return BadRequest($"Error al eliminar {EntityName} con ID {id}.");

        return Ok();
    }

    [HttpDelete("range/{ids}")]
    public async Task<ActionResult> DeleteRangeAsync([FromRoute] string ids)
    {
        List<int> idList = ids.Split(',').Select(int.Parse).ToList();

        foreach (var id in idList)
        {
            if (!await uow.RelativeTypeRepository.ExistsByIdAsync(id))
                return BadRequest($"{EntityName} con ID {id} no existe.");

            if (!await service.DeleteByIdAsync(id)) return BadRequest($"Error al eliminar {EntityName} con ID {id}.");
        }

        return Ok();
    }

    [HttpGet("xlsx")]
    public async Task<ActionResult> ExportToExcelAsync([FromQuery] RelativeTypeParams param)
    {
        var cattles = await uow.RelativeTypeRepository.GetPagedListAsync(param, true);
        var cattlesToExport = mapper.Map<List<RelativeTypeDto>>(cattles);

        using (var package = new ExcelPackage())
        {
            var worksheet = package.Workbook.Worksheets.Add("Cells");

            worksheet.Cells["A1"].Value = "ID";
            worksheet.Cells["B1"].Value = "Nombre";
            worksheet.Cells["C1"].Value = "Tipo";
            worksheet.Cells["D1"].Value = "Creado Por";
            worksheet.Cells["E1"].Value = "Nombre Anterior";

            worksheet.Cells["A2"].LoadFromCollection(cattlesToExport, PrintHeaders: false);

            var stream = new MemoryStream();

            await package.SaveAsAsync(stream);

            var content = stream.ToArray();
            var contentType = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
            var currentDateTime = DateTime.Now.ToString("yyyyMMdd_HHmmss");
            var fileName = $"cattles_{currentDateTime}.xlsx";

            return File(content, contentType, fileName);
        }
    }
}
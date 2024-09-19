using OfficeOpenXml;
using Microsoft.AspNetCore.Mvc;
using AutoMapper;
using MainService.Core.Interfaces.Services;
using MainService.Core.DTOs;
using MainService.Core.Helpers.Pagination;
using MainService.Extensions;
using MainService.Models.Entities.Aggregate;
using MainService.Models.Entities;

namespace MainService.Controllers;
public class SubstancesController(IUnitOfWork uow, IMapper mapper, ISubstancesService service) : BaseApiController
{
    private static readonly string EntityName = "Sustancia";
    
    [HttpGet]
    public async Task<ActionResult<PagedList<SubstanceDto>>> GetPagedListAsync([FromQuery] SubstanceParams param)
    {
        var pagedList = await uow.SubstanceRepository.GetPagedListAsync(param);

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
    public async Task<ActionResult<SubstanceDto>> ToggleVisibilityAsync([FromRoute] int id)
    {
        var item = await uow.SubstanceRepository.GetByIdAsync(id);

        if (item == null) return NotFound($"{EntityName} con ID {id} no encontrado.");

        item.Visible = !item.Visible;

        if (!await uow.Complete()) return BadRequest($"Error al cambiar la visibilidad de {EntityName} con ID {id}.");

        return await uow.SubstanceRepository.GetDtoByIdAsync(id);
    }

    [HttpGet("options")]
    public async Task<ActionResult<List<OptionDto>>> GetOptionDtosAsync() =>
        await uow.SubstanceRepository.GetOptionsAsync();

    [HttpGet("all")]
    public async Task<ActionResult<List<SubstanceDto>>> GetAllAsync()
    {
        var data = await uow.SubstanceRepository.GetAllDtosAsync();

        if (data.Count == 0) return NoContent();

        return data;
    }

    [HttpGet("nameexists")]
    public async Task<ActionResult<bool>> CheckNameExistsAsync([FromQuery] string name) =>
        await uow.SubstanceRepository.ExistsByNameAsync(name);

    [HttpGet("{id}")]
    public async Task<ActionResult<SubstanceDto>> GetByIdAsync([FromRoute] int id)
    {
        if (!await uow.SubstanceRepository.ExistsByIdAsync(id))
            return BadRequest($"La {EntityName} con ID {id} no existe.");

        return await uow.SubstanceRepository.GetDtoByIdAsync(id);
    }

    [HttpPost]
    public async Task<ActionResult<SubstanceDto>> AddAsync([FromBody] SubstanceCreateDto request)
    {
        if (!await uow.SubstanceRepository.ExistsByNameAsync(request.Name))
            return BadRequest($"El nombre {request.Name} ya existe.");

        if (!await uow.SubstanceRepository.ExistsByCodeAsync(request.Code))
            return BadRequest($"El código {request.Code} ya existe.");

        Substance itemToAdd = new();

        mapper.Map<SubstanceCreateDto, Substance>(request, itemToAdd);

        uow.SubstanceRepository.Add(itemToAdd);

        if (!await uow.Complete()) return BadRequest($"Error al agregar {EntityName}.");

        return await uow.SubstanceRepository.GetDtoByIdAsync(itemToAdd.Id);
    }

    [HttpPut("{id}")]
    public async Task<ActionResult<SubstanceDto>> UpdateAsync(
        [FromRoute] int id, 
        [FromBody] SubstanceUpdateDto request
    )
    {
        var itemToUpdate = await uow.SubstanceRepository.GetByIdAsync(id);

        if (itemToUpdate == null) return NotFound($"{EntityName} con ID {id} no encontrado.");

        mapper.Map<SubstanceUpdateDto, Substance>(request, itemToUpdate);

        if (!await uow.Complete()) return BadRequest($"Error al actualizar {EntityName} con ID {id}.");

        return await uow.SubstanceRepository.GetDtoByIdAsync(id);
    }

    [HttpDelete("{id}")]
    public async Task<ActionResult> DeleteByIdAsync([FromRoute] int id)
    {
        if (!await uow.SubstanceRepository.ExistsByIdAsync(id)) return BadRequest($"{EntityName} con ID {id} no existe.");

        if (!await service.DeleteByIdAsync(id)) return BadRequest($"Error al eliminar {EntityName} con ID {id}.");

        return Ok();
    }

    [HttpDelete("range/{ids}")]
    public async Task<ActionResult> DeleteRangeAsync([FromRoute] string ids)
    {
        List<int> idList = ids.Split(',').Select(int.Parse).ToList();

        foreach (var id in idList)
        {
            if (!await uow.SubstanceRepository.ExistsByIdAsync(id)) return BadRequest($"{EntityName} con ID {id} no existe.");

            if (!await service.DeleteByIdAsync(id)) return BadRequest($"Error al eliminar {EntityName} con ID {id}.");
        }

        return Ok();
    }

    [HttpGet("xlsx")]
    public async Task<ActionResult> ExportExcelAsync([FromQuery] SubstanceParams param)
    {
        PagedList<SubstanceDto> data = await uow.SubstanceRepository.GetPagedListAsync(param, true);
        List<SubstanceDto> dataToExport = mapper.Map<List<SubstanceDto>>(data);

        using (var package = new ExcelPackage())
        {
            var worksheet = package.Workbook.Worksheets.Add("Cells");

            worksheet.Cells["A1"].Value = "ID";
            worksheet.Cells["B1"].Value = "Nombre";
            worksheet.Cells["C1"].Value = "Tipo";
            worksheet.Cells["D1"].Value = "Creado Por";
            worksheet.Cells["E1"].Value = "Nombre Anterior";

            worksheet.Cells["A2"].LoadFromCollection(dataToExport, PrintHeaders: false);

            var stream = new MemoryStream();

            await package.SaveAsAsync(stream);

            var content = stream.ToArray();
            var contentType = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
            var currentDateTime = DateTime.Now.ToString("yyyyMMdd_HHmmss");
            var fileName = $"{EntityName}_{currentDateTime}.xlsx";

            return File(content, contentType, fileName);
        }
    }
}
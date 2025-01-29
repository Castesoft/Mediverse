using OfficeOpenXml;
using Microsoft.AspNetCore.Mvc;
using AutoMapper;
using MainService.Core.Interfaces.Services;
using MainService.Core.DTOs.MedicalRecord;
using MainService.Core.Helpers.Pagination;
using MainService.Extensions;
using MainService.Models.Entities.Aggregate;
using MainService.Models.Entities;

namespace MainService.Controllers;
public class ColorBlindnessesController(IUnitOfWork uow, IMapper mapper, IColorBlindnessesService service) : BaseApiController
{
    private static readonly string EntityName = "Tipo de Daltonismo";
    
    [HttpGet]
    public async Task<ActionResult<PagedList<ColorBlindnessDto>>> GetPagedListAsync([FromQuery] ColorBlindnessParams param)
    {
        var pagedList = await uow.ColorBlindnessRepository.GetPagedListAsync(param);

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
    public async Task<ActionResult<ColorBlindnessDto?>> ToggleVisibilityAsync([FromRoute] int id)
    {
        var item = await uow.ColorBlindnessRepository.GetByIdAsync(id);

        if (item == null) return NotFound($"{EntityName} con ID {id} no encontrado.");

        item.Visible = !item.Visible;

        if (!await uow.Complete()) return BadRequest($"Error al cambiar la visibilidad de {EntityName} con ID {id}.");

        return await uow.ColorBlindnessRepository.GetDtoByIdAsync(id);
    }

    [HttpGet("options")]
    public async Task<ActionResult<List<OptionDto>>> GetOptionDtosAsync() =>
        await uow.ColorBlindnessRepository.GetOptionsAsync();

    [HttpGet("all")]
    public async Task<ActionResult<List<ColorBlindnessDto>>> GetAllAsync()
    {
        var data = await uow.ColorBlindnessRepository.GetAllDtosAsync();

        if (data.Count == 0) return NoContent();

        return data;
    }

    [HttpGet("nameexists")]
    public async Task<ActionResult<bool>> CheckNameExistsAsync([FromQuery] string name) =>
        await uow.ColorBlindnessRepository.ExistsByNameAsync(name);

    [HttpGet("{id}")]
    public async Task<ActionResult<ColorBlindnessDto?>> GetByIdAsync([FromRoute] int id)
    {
        if (!await uow.ColorBlindnessRepository.ExistsByIdAsync(id))
            return BadRequest($"La {EntityName} con ID {id} no existe.");

        return await uow.ColorBlindnessRepository.GetDtoByIdAsync(id);
    }

    [HttpPost]
    public async Task<ActionResult<ColorBlindnessDto?>> AddAsync([FromBody] ColorBlindnessCreateDto request)
    {
        if (string.IsNullOrEmpty(request.Name)) return BadRequest("El nombre es requerido.");
        if (string.IsNullOrEmpty(request.Code)) return BadRequest("El código es requerido.");
        
        if (!await uow.ColorBlindnessRepository.ExistsByNameAsync(request.Name))
            return BadRequest($"El nombre {request.Name} ya existe.");

        if (!await uow.ColorBlindnessRepository.ExistsByCodeAsync(request.Code))
            return BadRequest($"El código {request.Code} ya existe.");

        ColorBlindness itemToAdd = new();

        mapper.Map<ColorBlindnessCreateDto, ColorBlindness>(request, itemToAdd);

        uow.ColorBlindnessRepository.Add(itemToAdd);

        if (!await uow.Complete()) return BadRequest($"Error al agregar {EntityName}.");

        return await uow.ColorBlindnessRepository.GetDtoByIdAsync(itemToAdd.Id);
    }

    [HttpPut("{id}")]
    public async Task<ActionResult<ColorBlindnessDto?>> UpdateAsync(
        [FromRoute] int id, 
        [FromBody] ColorBlindnessUpdateDto request
    )
    {
        var itemToUpdate = await uow.ColorBlindnessRepository.GetByIdAsync(id);

        if (itemToUpdate == null) return NotFound($"{EntityName} con ID {id} no encontrado.");

        mapper.Map<ColorBlindnessUpdateDto, ColorBlindness>(request, itemToUpdate);

        if (!await uow.Complete()) return BadRequest($"Error al actualizar {EntityName} con ID {id}.");

        return await uow.ColorBlindnessRepository.GetDtoByIdAsync(id);
    }

    [HttpDelete("{id}")]
    public async Task<ActionResult> DeleteByIdAsync([FromRoute] int id)
    {
        if (!await uow.ColorBlindnessRepository.ExistsByIdAsync(id)) return BadRequest($"{EntityName} con ID {id} no existe.");

        if (!await service.DeleteByIdAsync(id)) return BadRequest($"Error al eliminar {EntityName} con ID {id}.");

        return Ok();
    }

    [HttpDelete("range/{ids}")]
    public async Task<ActionResult> DeleteRangeAsync([FromRoute] string ids)
    {
        List<int> idList = ids.Split(',').Select(int.Parse).ToList();

        foreach (var id in idList)
        {
            if (!await uow.ColorBlindnessRepository.ExistsByIdAsync(id)) return BadRequest($"{EntityName} con ID {id} no existe.");

            if (!await service.DeleteByIdAsync(id)) return BadRequest($"Error al eliminar {EntityName} con ID {id}.");
        }

        return Ok();
    }

    [HttpGet("xlsx")]
    public async Task<ActionResult> ExportExcelAsync([FromQuery] ColorBlindnessParams param)
    {
        PagedList<ColorBlindnessDto> data = await uow.ColorBlindnessRepository.GetPagedListAsync(param, true);
        List<ColorBlindnessDto> dataToExport = mapper.Map<List<ColorBlindnessDto>>(data);

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
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
public class ConsumptionLevelsController(IUnitOfWork uow, IMapper mapper, IConsumptionLevelsService service) : BaseApiController
{
    private static readonly string EntityName = "Nivel de Consumo";
    
    [HttpGet]
    public async Task<ActionResult<PagedList<ConsumptionLevelDto>>> GetPagedListAsync([FromQuery] ConsumptionLevelParams param)
    {
        var pagedList = await uow.ConsumptionLevelRepository.GetPagedListAsync(param);

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
    public async Task<ActionResult<ConsumptionLevelDto?>> ToggleVisibilityAsync([FromRoute] int id)
    {
        var item = await uow.ConsumptionLevelRepository.GetByIdAsync(id);

        if (item == null) return NotFound($"{EntityName} con ID {id} no encontrado.");

        item.Visible = !item.Visible;

        if (!await uow.Complete()) return BadRequest($"Error al cambiar la visibilidad de {EntityName} con ID {id}.");

        return await uow.ConsumptionLevelRepository.GetDtoByIdAsync(id);
    }

    [HttpGet("options")]
    public async Task<ActionResult<List<OptionDto>>> GetOptionDtosAsync() =>
        await uow.ConsumptionLevelRepository.GetOptionsAsync();

    [HttpGet("all")]
    public async Task<ActionResult<List<ConsumptionLevelDto>>> GetAllAsync()
    {
        var data = await uow.ConsumptionLevelRepository.GetAllDtosAsync();

        if (data.Count == 0) return NoContent();

        return data;
    }

    [HttpGet("nameexists")]
    public async Task<ActionResult<bool>> CheckNameExistsAsync([FromQuery] string name) =>
        await uow.ConsumptionLevelRepository.ExistsByNameAsync(name);

    [HttpGet("{id}")]
    public async Task<ActionResult<ConsumptionLevelDto?>> GetByIdAsync([FromRoute] int id)
    {
        if (!await uow.ConsumptionLevelRepository.ExistsByIdAsync(id))
            return BadRequest($"La {EntityName} con ID {id} no existe.");

        return await uow.ConsumptionLevelRepository.GetDtoByIdAsync(id);
    }

    [HttpPost]
    public async Task<ActionResult<ConsumptionLevelDto?>> AddAsync([FromBody] ConsumptionLevelCreateDto request)
    {
        if (string.IsNullOrEmpty(request.Name)) return BadRequest("El nombre es requerido.");
        if (string.IsNullOrEmpty(request.Code)) return BadRequest("El código es requerido.");
        
        if (!await uow.ConsumptionLevelRepository.ExistsByNameAsync(request.Name))
            return BadRequest($"El nombre {request.Name} ya existe.");

        if (!await uow.ConsumptionLevelRepository.ExistsByCodeAsync(request.Code))
            return BadRequest($"El código {request.Code} ya existe.");

        ConsumptionLevel itemToAdd = new();

        mapper.Map<ConsumptionLevelCreateDto, ConsumptionLevel>(request, itemToAdd);

        uow.ConsumptionLevelRepository.Add(itemToAdd);

        if (!await uow.Complete()) return BadRequest($"Error al agregar {EntityName}.");

        return await uow.ConsumptionLevelRepository.GetDtoByIdAsync(itemToAdd.Id);
    }

    [HttpPut("{id}")]
    public async Task<ActionResult<ConsumptionLevelDto?>> UpdateAsync(
        [FromRoute] int id, 
        [FromBody] ConsumptionLevelUpdateDto request
    )
    {
        var itemToUpdate = await uow.ConsumptionLevelRepository.GetByIdAsync(id);

        if (itemToUpdate == null) return NotFound($"{EntityName} con ID {id} no encontrado.");

        mapper.Map<ConsumptionLevelUpdateDto, ConsumptionLevel>(request, itemToUpdate);

        if (!await uow.Complete()) return BadRequest($"Error al actualizar {EntityName} con ID {id}.");

        return await uow.ConsumptionLevelRepository.GetDtoByIdAsync(id);
    }

    [HttpDelete("{id}")]
    public async Task<ActionResult> DeleteByIdAsync([FromRoute] int id)
    {
        if (!await uow.ConsumptionLevelRepository.ExistsByIdAsync(id)) return BadRequest($"{EntityName} con ID {id} no existe.");

        if (!await service.DeleteByIdAsync(id)) return BadRequest($"Error al eliminar {EntityName} con ID {id}.");

        return Ok();
    }

    [HttpDelete("range/{ids}")]
    public async Task<ActionResult> DeleteRangeAsync([FromRoute] string ids)
    {
        List<int> idList = ids.Split(',').Select(int.Parse).ToList();

        foreach (var id in idList)
        {
            if (!await uow.ConsumptionLevelRepository.ExistsByIdAsync(id)) return BadRequest($"{EntityName} con ID {id} no existe.");

            if (!await service.DeleteByIdAsync(id)) return BadRequest($"Error al eliminar {EntityName} con ID {id}.");
        }

        return Ok();
    }

    [HttpGet("xlsx")]
    public async Task<ActionResult> ExportExcelAsync([FromQuery] ConsumptionLevelParams param)
    {
        PagedList<ConsumptionLevelDto> data = await uow.ConsumptionLevelRepository.GetPagedListAsync(param, true);
        List<ConsumptionLevelDto> dataToExport = mapper.Map<List<ConsumptionLevelDto>>(data);

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
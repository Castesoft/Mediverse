using OfficeOpenXml;
using Microsoft.AspNetCore.Mvc;
using AutoMapper;
using MainService.Core.Interfaces.Services;
using MainService.Core.Helpers.Pagination;
using MainService.Models.Entities;
using MainService.Extensions;
using MainService.Models.Entities.Aggregate;

namespace MainService.Controllers;
public class SpecialtiesController(IUnitOfWork uow, IMapper mapper, ISpecialtiesService service) : BaseApiController
{
    private static readonly string EntityName = "Especialidad";
    
    [HttpGet]
    public async Task<ActionResult<PagedList<SpecialtyDto>>> GetPagedListAsync([FromQuery] SpecialtyParams param)
    {
        var pagedList = await uow.SpecialtyRepository.GetPagedListAsync(param);

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
    public async Task<ActionResult<SpecialtyDto?>> ToggleVisibilityAsync([FromRoute] int id)
    {
        var item = await uow.SpecialtyRepository.GetByIdAsync(id);

        if (item == null) return NotFound($"{EntityName} con ID {id} no encontrado.");

        item.Visible = !item.Visible;

        if (!await uow.Complete()) return BadRequest($"Error al cambiar la visibilidad de {EntityName} con ID {id}.");

        return await uow.SpecialtyRepository.GetDtoByIdAsync(id);
    }

    [HttpGet("options")]
    public async Task<ActionResult<List<OptionDto>>> GetOptionDtosAsync() =>
        await uow.SpecialtyRepository.GetOptionsAsync();

    [HttpGet("all")]
    public async Task<ActionResult<List<SpecialtyDto>>> GetAllAsync()
    {
        var data = await uow.SpecialtyRepository.GetAllDtosAsync();

        if (data.Count == 0) return NoContent();

        return data;
    }

    [HttpGet("nameexists")]
    public async Task<ActionResult<bool>> CheckNameExistsAsync([FromQuery] string name) =>
        await uow.SpecialtyRepository.ExistsByNameAsync(name);

    [HttpGet("{id}")]
    public async Task<ActionResult<SpecialtyDto?>> GetByIdAsync([FromRoute] int id)
    {
        if (!await uow.SpecialtyRepository.ExistsByIdAsync(id))
            return BadRequest($"La {EntityName} con ID {id} no existe.");

        return await uow.SpecialtyRepository.GetDtoByIdAsync(id);
    }

    [HttpPost]
    public async Task<ActionResult<SpecialtyDto?>> AddAsync([FromBody] SpecialtyCreateDto request)
    {
        if (string.IsNullOrEmpty(request.Name)) return BadRequest("El nombre es requerido.");
        if (string.IsNullOrEmpty(request.Code)) return BadRequest("El código es requerido.");
        
        if (!await uow.SpecialtyRepository.ExistsByNameAsync(request.Name))
            return BadRequest($"El nombre {request.Name} ya existe.");

        if (!await uow.SpecialtyRepository.ExistsByCodeAsync(request.Code))
            return BadRequest($"El código {request.Code} ya existe.");

        Specialty itemToAdd = new();

        mapper.Map<SpecialtyCreateDto, Specialty>(request, itemToAdd);

        uow.SpecialtyRepository.Add(itemToAdd);

        if (!await uow.Complete()) return BadRequest($"Error al agregar {EntityName}.");

        return await uow.SpecialtyRepository.GetDtoByIdAsync(itemToAdd.Id);
    }

    [HttpPut("{id}")]
    public async Task<ActionResult<SpecialtyDto?>> UpdateAsync(
        [FromRoute] int id, 
        [FromBody] SpecialtyUpdateDto request
    )
    {
        var itemToUpdate = await uow.SpecialtyRepository.GetByIdAsync(id);

        if (itemToUpdate == null) return NotFound($"{EntityName} con ID {id} no encontrado.");

        mapper.Map<SpecialtyUpdateDto, Specialty>(request, itemToUpdate);

        if (!await uow.Complete()) return BadRequest($"Error al actualizar {EntityName} con ID {id}.");

        return await uow.SpecialtyRepository.GetDtoByIdAsync(id);
    }

    [HttpDelete("{id}")]
    public async Task<ActionResult> DeleteByIdAsync([FromRoute] int id)
    {
        if (!await uow.SpecialtyRepository.ExistsByIdAsync(id)) return BadRequest($"{EntityName} con ID {id} no existe.");

        if (!await service.DeleteByIdAsync(id)) return BadRequest($"Error al eliminar {EntityName} con ID {id}.");

        return Ok();
    }

    [HttpDelete("range/{ids}")]
    public async Task<ActionResult> DeleteRangeAsync([FromRoute] string ids)
    {
        List<int> idList = ids.Split(',').Select(int.Parse).ToList();

        foreach (var id in idList)
        {
            if (!await uow.SpecialtyRepository.ExistsByIdAsync(id)) return BadRequest($"{EntityName} con ID {id} no existe.");

            if (!await service.DeleteByIdAsync(id)) return BadRequest($"Error al eliminar {EntityName} con ID {id}.");
        }

        return Ok();
    }

    [HttpGet("xlsx")]
    public async Task<ActionResult> ExportExcelAsync([FromQuery] SpecialtyParams param)
    {
        PagedList<SpecialtyDto> data = await uow.SpecialtyRepository.GetPagedListAsync(param, true);
        List<SpecialtyDto> dataToExport = mapper.Map<List<SpecialtyDto>>(data);

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
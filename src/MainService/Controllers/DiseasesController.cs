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
public class DiseasesController(IUnitOfWork uow, IMapper mapper, IDiseasesService service) : BaseApiController
{
    private static readonly string EntityName = "Enfermedad";
    
    [HttpGet]
    public async Task<ActionResult<PagedList<DiseaseDto>>> GetPagedListAsync([FromQuery] DiseaseParams param)
    {
        var pagedList = await uow.DiseaseRepository.GetPagedListAsync(param);

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
    public async Task<ActionResult<DiseaseDto?>> ToggleVisibilityAsync([FromRoute] int id)
    {
        var item = await uow.DiseaseRepository.GetByIdAsync(id);

        if (item == null) return NotFound($"{EntityName} con ID {id} no encontrado.");

        item.Visible = !item.Visible;

        if (!await uow.Complete()) return BadRequest($"Error al cambiar la visibilidad de {EntityName} con ID {id}.");

        return await uow.DiseaseRepository.GetDtoByIdAsync(id);
    }

    [HttpGet("options")]
    public async Task<ActionResult<List<OptionDto>>> GetOptionDtosAsync() =>
        await uow.DiseaseRepository.GetOptionsAsync();

    [HttpGet("all")]
    public async Task<ActionResult<List<DiseaseDto>>> GetAllAsync()
    {
        var data = await uow.DiseaseRepository.GetAllDtosAsync();

        if (data.Count == 0) return NoContent();

        return data;
    }

    [HttpGet("nameexists")]
    public async Task<ActionResult<bool>> CheckNameExistsAsync([FromQuery] string name) =>
        await uow.DiseaseRepository.ExistsByNameAsync(name);

    [HttpGet("{id}")]
    public async Task<ActionResult<DiseaseDto?>> GetByIdAsync([FromRoute] int id)
    {
        if (!await uow.DiseaseRepository.ExistsByIdAsync(id))
            return BadRequest($"La {EntityName} con ID {id} no existe.");

        return await uow.DiseaseRepository.GetDtoByIdAsync(id);
    }

    [HttpPost]
    public async Task<ActionResult<DiseaseDto?>> AddAsync([FromBody] DiseaseCreateDto request)
    {
        if (string.IsNullOrEmpty(request.Name)) return BadRequest("El nombre es requerido.");
        if (string.IsNullOrEmpty(request.Code)) return BadRequest("El código es requerido.");
        
        if (!await uow.DiseaseRepository.ExistsByNameAsync(request.Name))
            return BadRequest($"El nombre {request.Name} ya existe.");

        if (!await uow.DiseaseRepository.ExistsByCodeAsync(request.Code))
            return BadRequest($"El código {request.Code} ya existe.");

        Disease itemToAdd = new();

        mapper.Map<DiseaseCreateDto, Disease>(request, itemToAdd);

        uow.DiseaseRepository.Add(itemToAdd);

        if (!await uow.Complete()) return BadRequest($"Error al agregar {EntityName}.");

        return await uow.DiseaseRepository.GetDtoByIdAsync(itemToAdd.Id);
    }

    [HttpPut("{id}")]
    public async Task<ActionResult<DiseaseDto?>> UpdateAsync(
        [FromRoute] int id, 
        [FromBody] DiseaseUpdateDto request
    )
    {
        var itemToUpdate = await uow.DiseaseRepository.GetByIdAsync(id);

        if (itemToUpdate == null) return NotFound($"{EntityName} con ID {id} no encontrado.");

        mapper.Map<DiseaseUpdateDto, Disease>(request, itemToUpdate);

        if (!await uow.Complete()) return BadRequest($"Error al actualizar {EntityName} con ID {id}.");

        return await uow.DiseaseRepository.GetDtoByIdAsync(id);
    }

    [HttpDelete("{id}")]
    public async Task<ActionResult> DeleteByIdAsync([FromRoute] int id)
    {
        if (!await uow.DiseaseRepository.ExistsByIdAsync(id)) return BadRequest($"{EntityName} con ID {id} no existe.");

        if (!await service.DeleteByIdAsync(id)) return BadRequest($"Error al eliminar {EntityName} con ID {id}.");

        return Ok();
    }

    [HttpDelete("range/{ids}")]
    public async Task<ActionResult> DeleteRangeAsync([FromRoute] string ids)
    {
        List<int> idList = ids.Split(',').Select(int.Parse).ToList();

        foreach (var id in idList)
        {
            if (!await uow.DiseaseRepository.ExistsByIdAsync(id)) return BadRequest($"{EntityName} con ID {id} no existe.");

            if (!await service.DeleteByIdAsync(id)) return BadRequest($"Error al eliminar {EntityName} con ID {id}.");
        }

        return Ok();
    }

    [HttpGet("xlsx")]
    public async Task<ActionResult> ExportExcelAsync([FromQuery] DiseaseParams param)
    {
        PagedList<DiseaseDto> data = await uow.DiseaseRepository.GetPagedListAsync(param, true);
        List<DiseaseDto> dataToExport = mapper.Map<List<DiseaseDto>>(data);

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
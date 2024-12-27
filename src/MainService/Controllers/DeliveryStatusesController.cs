using AutoMapper;
using MainService.Core.DTOs.DeliveryStatuses;
using MainService.Core.Helpers.Pagination;
using MainService.Core.Helpers.Params;
using MainService.Core.Interfaces.Services;
using MainService.Extensions;
using MainService.Models.Entities;
using MainService.Models.Entities.Aggregate;
using Microsoft.AspNetCore.Mvc;
using OfficeOpenXml;

namespace MainService.Controllers
{
    public class DeliveryStatusesController(IUnitOfWork uow, IMapper mapper, IDeliveryStatusesService service) : BaseApiController
    {
        private static readonly string EntityName = "Estado de Pedido";

        [HttpGet]
        public async Task<ActionResult<PagedList<DeliveryStatusDto>>> GetPagedListAsync([FromQuery] DeliveryStatusParams param)
        {
            var pagedList = await uow.DeliveryStatusRepository.GetPagedListAsync(param);

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
        public async Task<ActionResult<DeliveryStatusDto?>> ToggleVisibilityAsync([FromRoute] int id)
        {
            var item = await uow.DeliveryStatusRepository.GetByIdAsync(id);

            if (item == null) return NotFound($"{EntityName} con ID {id} no encontrado.");

            item.Visible = !item.Visible;

            if (!await uow.Complete()) return BadRequest($"Error al cambiar la visibilidad de {EntityName} con ID {id}.");

            return await uow.DeliveryStatusRepository.GetDtoByIdAsync(id);
        }

        [HttpGet("options")]
        public async Task<ActionResult<List<OptionDto>>> GetOptionDtosAsync() =>
            await uow.DeliveryStatusRepository.GetOptionsAsync();

        [HttpGet("all")]
        public async Task<ActionResult<List<DeliveryStatusDto>>> GetAllAsync()
        {
            var data = await uow.DeliveryStatusRepository.GetAllDtosAsync();

            if (data.Count == 0) return NoContent();

            return data;
        }

        [HttpGet("nameexists")]
        public async Task<ActionResult<bool>> CheckNameExistsAsync([FromQuery] string name) =>
            await uow.DeliveryStatusRepository.ExistsByNameAsync(name);

        [HttpGet("{id}")]
        public async Task<ActionResult<DeliveryStatusDto?>> GetByIdAsync([FromRoute] int id)
        {
            if (!await uow.DeliveryStatusRepository.ExistsByIdAsync(id))
                return BadRequest($"La {EntityName} con ID {id} no existe.");

            return await uow.DeliveryStatusRepository.GetDtoByIdAsync(id);
        }

        [HttpPost]
        public async Task<ActionResult<DeliveryStatusDto?>> AddAsync([FromBody] DeliveryStatusCreateDto request)
        {
            if (string.IsNullOrEmpty(request.Name)) return BadRequest("El nombre es requerido.");
            if (string.IsNullOrEmpty(request.Code)) return BadRequest("El código es requerido.");

            if (!await uow.DeliveryStatusRepository.ExistsByNameAsync(request.Name))
                return BadRequest($"El nombre {request.Name} ya existe.");

            if (!await uow.DeliveryStatusRepository.ExistsByCodeAsync(request.Code))
                return BadRequest($"El código {request.Code} ya existe.");

            DeliveryStatus itemToAdd = new();

            mapper.Map<DeliveryStatusCreateDto, DeliveryStatus>(request, itemToAdd);

            uow.DeliveryStatusRepository.Add(itemToAdd);

            if (!await uow.Complete()) return BadRequest($"Error al agregar {EntityName}.");

            return await uow.DeliveryStatusRepository.GetDtoByIdAsync(itemToAdd.Id);
        }

        [HttpPut("{id}")]
        public async Task<ActionResult<DeliveryStatusDto?>> UpdateAsync(
            [FromRoute] int id,
            [FromBody] DeliveryStatusUpdateDto request
        )
        {
            var itemToUpdate = await uow.DeliveryStatusRepository.GetByIdAsync(id);

            if (itemToUpdate == null) return NotFound($"{EntityName} con ID {id} no encontrado.");

            mapper.Map<DeliveryStatusUpdateDto, DeliveryStatus>(request, itemToUpdate);

            if (!await uow.Complete()) return BadRequest($"Error al actualizar {EntityName} con ID {id}.");

            return await uow.DeliveryStatusRepository.GetDtoByIdAsync(id);
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult> DeleteByIdAsync([FromRoute] int id)
        {
            if (!await uow.DeliveryStatusRepository.ExistsByIdAsync(id)) return BadRequest($"{EntityName} con ID {id} no existe.");

            if (!await service.DeleteByIdAsync(id)) return BadRequest($"Error al eliminar {EntityName} con ID {id}.");

            return Ok();
        }

        [HttpDelete("range/{ids}")]
        public async Task<ActionResult> DeleteRangeAsync([FromRoute] string ids)
        {
            List<int> idList = ids.Split(',').Select(int.Parse).ToList();

            foreach (var id in idList)
            {
                if (!await uow.DeliveryStatusRepository.ExistsByIdAsync(id)) return BadRequest($"{EntityName} con ID {id} no existe.");

                if (!await service.DeleteByIdAsync(id)) return BadRequest($"Error al eliminar {EntityName} con ID {id}.");
            }

            return Ok();
        }

        [HttpGet("xlsx")]
        public async Task<ActionResult> ExportExcelAsync([FromQuery] DeliveryStatusParams param)
        {
            PagedList<DeliveryStatusDto> data = await uow.DeliveryStatusRepository.GetPagedListAsync(param, true);
            List<DeliveryStatusDto> dataToExport = mapper.Map<List<DeliveryStatusDto>>(data);

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
}
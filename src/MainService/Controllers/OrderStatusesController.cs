using AutoMapper;
using MainService.Core.DTOs.OrderStatuses;
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
    public class OrderStatusesController(IUnitOfWork uow, IMapper mapper, IOrderStatusesService service) : BaseApiController
    {
        private static readonly string EntityName = "Estado de Pedido";

        [HttpGet]
        public async Task<ActionResult<PagedList<OrderStatusDto>>> GetPagedListAsync([FromQuery] OrderStatusParams param)
        {
            var pagedList = await uow.OrderStatusRepository.GetPagedListAsync(param);

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
        public async Task<ActionResult<OrderStatusDto?>> ToggleVisibilityAsync([FromRoute] int id)
        {
            var item = await uow.OrderStatusRepository.GetByIdAsync(id);

            if (item == null) return NotFound($"{EntityName} con ID {id} no encontrado.");

            item.Visible = !item.Visible;

            if (!await uow.Complete()) return BadRequest($"Error al cambiar la visibilidad de {EntityName} con ID {id}.");

            return await uow.OrderStatusRepository.GetDtoByIdAsync(id);
        }

        [HttpGet("options")]
        public async Task<ActionResult<List<OptionDto>>> GetOptionDtosAsync() =>
            await uow.OrderStatusRepository.GetOptionsAsync();

        [HttpGet("all")]
        public async Task<ActionResult<List<OrderStatusDto>>> GetAllAsync()
        {
            var data = await uow.OrderStatusRepository.GetAllDtosAsync();

            if (data.Count == 0) return NoContent();

            return data;
        }

        [HttpGet("nameexists")]
        public async Task<ActionResult<bool>> CheckNameExistsAsync([FromQuery] string name) =>
            await uow.OrderStatusRepository.ExistsByNameAsync(name);

        [HttpGet("{id}")]
        public async Task<ActionResult<OrderStatusDto?>> GetByIdAsync([FromRoute] int id)
        {
            if (!await uow.OrderStatusRepository.ExistsByIdAsync(id))
                return BadRequest($"La {EntityName} con ID {id} no existe.");

            return await uow.OrderStatusRepository.GetDtoByIdAsync(id);
        }

        [HttpPost]
        public async Task<ActionResult<OrderStatusDto?>> AddAsync([FromBody] OrderStatusCreateDto request)
        {
            if (string.IsNullOrEmpty(request.Name)) return BadRequest("El nombre es requerido.");
            if (string.IsNullOrEmpty(request.Code)) return BadRequest("El código es requerido.");

            if (!await uow.OrderStatusRepository.ExistsByNameAsync(request.Name))
                return BadRequest($"El nombre {request.Name} ya existe.");

            if (!await uow.OrderStatusRepository.ExistsByCodeAsync(request.Code))
                return BadRequest($"El código {request.Code} ya existe.");

            OrderStatus itemToAdd = new();

            mapper.Map<OrderStatusCreateDto, OrderStatus>(request, itemToAdd);

            uow.OrderStatusRepository.Add(itemToAdd);

            if (!await uow.Complete()) return BadRequest($"Error al agregar {EntityName}.");

            return await uow.OrderStatusRepository.GetDtoByIdAsync(itemToAdd.Id);
        }

        [HttpPut("{id}")]
        public async Task<ActionResult<OrderStatusDto?>> UpdateAsync(
            [FromRoute] int id,
            [FromBody] OrderStatusUpdateDto request
        )
        {
            var itemToUpdate = await uow.OrderStatusRepository.GetByIdAsync(id);

            if (itemToUpdate == null) return NotFound($"{EntityName} con ID {id} no encontrado.");

            mapper.Map<OrderStatusUpdateDto, OrderStatus>(request, itemToUpdate);

            if (!await uow.Complete()) return BadRequest($"Error al actualizar {EntityName} con ID {id}.");

            return await uow.OrderStatusRepository.GetDtoByIdAsync(id);
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult> DeleteByIdAsync([FromRoute] int id)
        {
            if (!await uow.OrderStatusRepository.ExistsByIdAsync(id)) return BadRequest($"{EntityName} con ID {id} no existe.");

            if (!await service.DeleteByIdAsync(id)) return BadRequest($"Error al eliminar {EntityName} con ID {id}.");

            return Ok();
        }

        [HttpDelete("range/{ids}")]
        public async Task<ActionResult> DeleteRangeAsync([FromRoute] string ids)
        {
            List<int> idList = ids.Split(',').Select(int.Parse).ToList();

            foreach (var id in idList)
            {
                if (!await uow.OrderStatusRepository.ExistsByIdAsync(id)) return BadRequest($"{EntityName} con ID {id} no existe.");

                if (!await service.DeleteByIdAsync(id)) return BadRequest($"Error al eliminar {EntityName} con ID {id}.");
            }

            return Ok();
        }

        [HttpGet("xlsx")]
        public async Task<ActionResult> ExportExcelAsync([FromQuery] OrderStatusParams param)
        {
            PagedList<OrderStatusDto> data = await uow.OrderStatusRepository.GetPagedListAsync(param, true);
            List<OrderStatusDto> dataToExport = mapper.Map<List<OrderStatusDto>>(data);

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
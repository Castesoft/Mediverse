using MainService.Core.DTOs.Orders;
using MainService.Core.Extensions;
using MainService.Core.Helpers.Pagination;
using MainService.Core.Helpers.Params;
using MainService.Core.Interfaces.Services;
using MainService.Extensions;
using MainService.Models.Entities;
using Microsoft.AspNetCore.Mvc;

namespace MainService.Controllers;

public class OrdersController(IUnitOfWork uow
// ,IMapper mapper, 
// UserManager<AppUser> userManager
) : BaseApiController
{
    private static readonly string subject = "orden";
    private static readonly string subjectArticle = "La";

    [HttpGet]
    public async Task<ActionResult<PagedList<OrderDto>>> GetPagedListAsync([FromQuery] OrderParams param)
    {
        param.DoctorId = User.GetUserId();
        
        var pagedList = await uow.OrderRepository.GetPagedListAsync(param);

        Response.AddPaginationHeader(new PaginationHeader(pagedList.CurrentPage, pagedList.PageSize,
            pagedList.TotalCount, pagedList.TotalPages));

        return pagedList;
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<OrderDto?>> GetByIdAsync([FromRoute] int id)
    {
        var order = await uow.OrderRepository.GetDtoByIdAsync(id);

        if (order == null) return NotFound($"{subjectArticle} {subject} no existe");

        return order;
    }


    [HttpPut("{id}")]
    public async Task<ActionResult<OrderDto?>> UpdateAsync([FromRoute] int id, [FromBody] OrderUpdateDto request)
    {
        if (!await uow.OrderRepository.ExistsByIdAsync(id)) return NotFound($"{subjectArticle} {subject} no existe");
        
        if (request.DeliveryStatus == null) return BadRequest("El estado de entrega es requerido");
        if (!request.DeliveryStatus.Id.HasValue) return BadRequest("El estado de entrega es requerido");
        if (request.Status == null) return BadRequest("El estado es requerido");
        if (!request.Status.Id.HasValue) return BadRequest("El estado es requerido");

        Order? order = await uow.OrderRepository.GetByIdAsync(id);

        if (order == null) return NotFound($"{subjectArticle} {subject} no existe");

        if (!await uow.DeliveryStatusRepository.ExistsByIdAsync(request.DeliveryStatus.Id.Value)) return NotFound("Estado de entrega no existe");
        if (!await uow.OrderStatusRepository.ExistsByIdAsync(request.Status.Id.Value)) return NotFound("Estado de orden no existe");

        order.OrderDeliveryStatus = new(request.DeliveryStatus.Id.Value);
        order.OrderOrderStatus = new(request.Status.Id.Value);

        if (uow.HasChanges()) {
            if (!await uow.Complete()) return BadRequest($"Error al actualizar {subjectArticle} {subject} con ID {id}.");
        }

        return await uow.OrderRepository.GetDtoByIdAsync(id);
    }

    [HttpPut("{id}/approve")]
    public async Task<ActionResult<OrderDto?>> ApproveAsync([FromRoute] int id)
    {
        if (!await uow.OrderRepository.ExistsByIdAsync(id)) return NotFound($"{subjectArticle} {subject} no existe");
        
        OrderStatus? orderStatus = await uow.OrderStatusRepository.GetByNameAsync("Completado");
        DeliveryStatus? deliveryStatus = await uow.DeliveryStatusRepository.GetByNameAsync("Procesando");

        if (orderStatus == null) return NotFound("Estado de orden no existe");
        if (deliveryStatus == null) return NotFound("Estado de entrega no existe");

        Order? order = await uow.OrderRepository.GetByIdAsync(id);

        if (order == null) return NotFound($"{subjectArticle} {subject} no existe");
        
        // order.Status = OrderStatus.Completed;
        // order.DeliveryStatus = OrderDeliveryStatus.Processing;

        order.OrderOrderStatus = new(orderStatus.Id);
        order.OrderDeliveryStatus = new(deliveryStatus.Id);

        if (uow.HasChanges()) {
            if (!await uow.Complete()) return BadRequest($"Error al aprobar {subjectArticle} {subject} con ID {id}.");
        }
        
        return await uow.OrderRepository.GetDtoByIdAsync(id);
    }
}
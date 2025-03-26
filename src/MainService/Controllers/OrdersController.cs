using MainService.Core.DTOs.Orders;
using MainService.Core.Extensions;
using MainService.Core.Helpers;
using MainService.Core.Helpers.Pagination;
using MainService.Core.Helpers.Params;
using MainService.Core.Interfaces.Services;
using MainService.Extensions;
using MainService.Models.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Serilog;
using MainService.Authorization.Operations;

namespace MainService.Controllers;

public class OrdersController(IUnitOfWork uow, IOrdersService ordersService, IAuthorizationService authService) : BaseApiController
{
    private const string Subject = "orden";
    private const string SubjectArticle = "La";

    [HttpGet]
    public async Task<ActionResult<PagedList<OrderDto>>> GetPagedListAsync([FromQuery] OrderParams param)
    {
        param.RequestingUserId = User.GetUserId();
        param.RequestingUserRole = User.GetRoles();

        var pagedList = await uow.OrderRepository.GetPagedListAsync(param);

        Response.AddPaginationHeader(new PaginationHeader(
            pagedList.CurrentPage,
            pagedList.PageSize,
            pagedList.TotalCount,
            pagedList.TotalPages
        ));

        return pagedList;
    }

    [HttpGet("{id:int}")]
    public async Task<ActionResult<OrderDto?>> GetByIdAsync([FromRoute] int id)
    {
        var order = await uow.OrderRepository.GetByIdAsNoTrackingAsync(id);
        if (order == null) return NotFound($"{SubjectArticle} {Subject} no existe");

        var authorizationResult = await authService.AuthorizeAsync(User, order, OrderOperations.Read);
        if (!authorizationResult.Succeeded) return Forbid();

        var orderDto = await uow.OrderRepository.GetDtoByIdAsync(id);
        return orderDto;
    }

    [Authorize]
    [HttpPut("{id:int}")]
    public async Task<ActionResult<OrderDto>> UpdateAsync([FromRoute] int id, [FromBody] OrderUpdateDto request)
    {
        var userId = User.GetUserId();
        if (userId == 0) return Unauthorized();

        var order = await uow.OrderRepository.GetByIdAsync(id);
        if (order == null) return NotFound($"{SubjectArticle} {Subject} no existe");

        var authorizationResult = await authService.AuthorizeAsync(User, order, OrderOperations.Update);
        if (!authorizationResult.Succeeded) return Forbid();

        try
        {
            var result = await ordersService.UpdateAsync(request, id, userId);
            return Ok(result);
        }
        catch (NotFoundException ex)
        {
            return NotFound(ex.Message);
        }
        catch (BadRequestException ex)
        {
            return BadRequest(ex.Message);
        }
        catch (Exception ex)
        {
            Log.Error(ex, "Error al actualizar {SubjectArticle} {Subject} con ID {Id}", SubjectArticle, Subject, id);
            return StatusCode(500, ex.Message);
        }
    }

    [HttpGet("{id:int}/history")]
    public async Task<ActionResult<List<OrderHistoryDto>>?> GetHistoryAsync([FromRoute] int id)
    {
        var order = await uow.OrderRepository.GetByIdAsync(id);
        if (order == null) return NotFound($"{SubjectArticle} {Subject} no existe");

        var authorizationResult = await authService.AuthorizeAsync(User, order, OrderOperations.Read);
        if (!authorizationResult.Succeeded) return Forbid();

        var history = await uow.OrderRepository.GetHistoryByIdAsync(id);
        return history;
    }

    [HttpPut("{id:int}/approve")]
    public async Task<ActionResult<OrderDto?>> ApproveAsync([FromRoute] int id)
    {
        var order = await uow.OrderRepository.GetByIdAsync(id);
        if (order == null) return NotFound($"{SubjectArticle} {Subject} no existe");

        var authorizationResult = await authService.AuthorizeAsync(User, order, OrderOperations.Approve);
        if (!authorizationResult.Succeeded) return Forbid();

        var orderStatus = await uow.OrderStatusRepository.GetByNameAsync("Completado");
        var deliveryStatus = await uow.DeliveryStatusRepository.GetByNameAsync("Procesando");

        if (orderStatus == null) return NotFound("Estado de orden no existe");
        if (deliveryStatus == null) return NotFound("Estado de entrega no existe");

        // order.Status = OrderStatus.Completed;
        // order.DeliveryStatus = OrderDeliveryStatus.Processing;

        order.OrderOrderStatus = new OrderOrderStatus(orderStatus.Id);
        order.OrderDeliveryStatus = new OrderDeliveryStatus(deliveryStatus.Id);

        if (!uow.HasChanges()) return await uow.OrderRepository.GetDtoByIdAsync(id);
        if (!await uow.Complete()) return BadRequest($"Error al aprobar {SubjectArticle} {Subject} con ID {id}.");

        return await uow.OrderRepository.GetDtoByIdAsync(id);
    }
}
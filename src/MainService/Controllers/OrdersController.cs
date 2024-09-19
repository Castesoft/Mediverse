using System.Reflection;
using System.Runtime.Serialization;
using AutoMapper;
using MainService.Core.DTOs.Orders;
using MainService.Core.Helpers.Pagination;
using MainService.Core.Helpers.Params;
using MainService.Core.Interfaces.Services;
using MainService.Extensions;
using MainService.Models.Entities;
using Microsoft.AspNetCore.Identity;
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
        var pagedList = await uow.OrderRepository.GetPagedListAsync(param, User);

        Response.AddPaginationHeader(new PaginationHeader(pagedList.CurrentPage, pagedList.PageSize,
            pagedList.TotalCount, pagedList.TotalPages));

        return pagedList;
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<OrderDto>> GetByIdAsync([FromRoute] int id)
    {
        var order = await uow.OrderRepository.GetDtoByIdAsync(id);

        if (order == null) return NotFound($"{subjectArticle} {subject} no existe");

        return order;
    }


    [HttpPut("{id}")]
    public async Task<ActionResult<OrderDto>> UpdateAsync([FromRoute] int id, [FromBody] OrderUpdateDto request)
    {
        var order = await uow.OrderRepository.GetByIdAsync(id);

        if (order == null) return NotFound($"{subjectArticle} {subject} no existe");

        order.Status = GetEnumFromMemberValue<OrderStatus>(request.Status);
        order.DeliveryStatus = GetEnumFromMemberValue<OrderDeliveryStatus>(request.DeliveryStatus);

        await uow.Complete();

        return await uow.OrderRepository.GetDtoByIdAsync(id);
    }

    [HttpPut("{id}/approve")]
    public async Task<ActionResult<OrderDto>> ApproveAsync([FromRoute] int id)
    {
        var order = await uow.OrderRepository.GetByIdAsync(id);

        if (order == null) return NotFound($"{subjectArticle} {subject} no existe");
        
        order.Status = OrderStatus.Completed;
        order.DeliveryStatus = OrderDeliveryStatus.Processing;

        if (!await uow.Complete()) return BadRequest($"Error al aprobar {subjectArticle} {subject} con ID {id}.");

        return await uow.OrderRepository.GetDtoByIdAsync(id);
    }

    private T GetEnumFromMemberValue<T>(string value) where T : Enum
    {
        var type = typeof(T);
        foreach (var field in type.GetFields())
        {
            var attribute = field.GetCustomAttribute<EnumMemberAttribute>();
            if (attribute != null && attribute.Value == value)
            {
                return (T)field.GetValue(null);
            }
        }

        return (T)Enum.Parse(type, value, true);
    }
}
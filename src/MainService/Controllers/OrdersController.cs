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
public class OrdersController(IUnitOfWork uow, IMapper mapper, UserManager<AppUser> userManager) : BaseApiController
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
}
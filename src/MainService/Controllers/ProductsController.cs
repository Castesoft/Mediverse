using AutoMapper;
using MainService.Core.DTOs.Products;
using MainService.Core.Helpers.Pagination;
using MainService.Core.Helpers.Params;
using MainService.Core.Interfaces.Services;
using MainService.Extensions;
using MainService.Models.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace MainService.Controllers;
public class ProductsController(IUnitOfWork uow, IProductsService service, IMapper mapper) : BaseApiController
{
    private static readonly string subject = "producto";
    private static readonly string subjectArticle = "El";

    [HttpGet]
    public async Task<ActionResult<PagedList<ProductDto>>> GetPagedListAsync([FromQuery] ProductParams param)
    {
        var pagedList = await uow.ProductRepository.GetPagedListAsync(param);

        Response.AddPaginationHeader(
            new PaginationHeader(pagedList.CurrentPage,pagedList.PageSize,pagedList.TotalCount,pagedList.TotalPages));

        return pagedList;
    }

    [AllowAnonymous]
    [HttpGet("all")]
    public async Task<ActionResult<List<ProductDto>>> GetAllAsync([FromQuery] ProductParams param)
    {
        var data = await uow.ProductRepository.GetAllDtoAsync(param);
        
        return data;
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<ProductDto>> GetByIdAsync([FromRoute]int id)
    {
        var item = await uow.ProductRepository.GetDtoByIdAsync(id);

        if (item == null) return NotFound($"{subjectArticle} {subject} de ID {id} no fue encontrado.");

        return item;
    }

    [HttpPost]
    public async Task<ActionResult<ProductDto>> AddAsync([FromBody] ProductCreateDto request)
    {
        Product item = new();

        mapper.Map(request, item);

        uow.ProductRepository.Add(item);

        if (!await uow.Complete()) return BadRequest($"Error al agregar {subjectArticle} {subject}.");

        var itemToReturn = await uow.ProductRepository.GetDtoByIdAsync(item.Id);
        return itemToReturn;
    }

    [HttpPut("{id}")]
    public async Task<ActionResult<ProductDto>> UpdateAsync([FromRoute] int id, [FromBody] ProductUpdateDto request)
    {
        var item = await uow.ProductRepository.GetByIdAsync(id);

        if (item == null) return NotFound($"{subjectArticle} {subject} con ID {id} no fue encontrado.");

        mapper.Map(request, item);

        if (!await uow.Complete()) return BadRequest($"Error al actualizar {subjectArticle} {subject} con ID {id}.");

        var itemToReturn = await uow.ProductRepository.GetDtoByIdAsync(id);
        return itemToReturn;
    }

    [Authorize(Policy = "RequireAdminRole")]
    [HttpDelete("{id}")]
    public async Task<ActionResult> DeleteByIdAsync(int id)
    {
        var item = await uow.ProductRepository.GetByIdAsNoTrackingAsync(id);

        if (item == null) return NotFound($"{subjectArticle} {subject} de ID {id} no fue encontrado.");

        var deleteResult = await service.DeleteAsync(item);

        if (!deleteResult) return BadRequest($"Error al eliminar {subject} de {item.Name}.");

        return Ok();
    }

    [HttpDelete("range/{ids}")]
    public async Task<ActionResult> DeleteRangeAsync([FromRoute]string ids)
    {   
        var selectedIds = ids.Split(',').Select(int.Parse).ToList();

        foreach (var item in selectedIds)
        {
            var itemToDelete = await uow.ProductRepository.GetByIdAsNoTrackingAsync(item);

            if (itemToDelete == null) return NotFound($"{subjectArticle} {subject} de ID {item} no fue encontrado.");

            var deleteResult = await service.DeleteAsync(itemToDelete);

            if (!deleteResult) return BadRequest($"Error al eliminar {subject} de {itemToDelete.Id}.");
        }
        
        return Ok();
    }
}
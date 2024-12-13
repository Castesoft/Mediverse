using AutoMapper;
using MainService.Core.Extensions;
using MainService.Core.DTOs.Products;
using MainService.Core.Helpers.Pagination;
using MainService.Core.Helpers.Params;
using MainService.Core.Interfaces.Services;
using MainService.Extensions;
using MainService.Models.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MainService.Models.Entities.Aggregate;

namespace MainService.Controllers;
public class ProductsController(IUnitOfWork uow, IProductsService service, IMapper mapper, UserManager<AppUser> userManager) : BaseApiController
{
    private static readonly string subject = "producto";
    private static readonly string subjectArticle = "El";

    [HttpGet("options")]
    public async Task<ActionResult<List<OptionDto>>> GetOptionsAsync([FromQuery] ProductParams param) {
        int userId = User.GetUserId();

        param.DoctorId = userId;

        List<OptionDto> data = await uow.ProductRepository.GetOptionsAsync(param);

        return data;
    }

    [HttpGet]
    public async Task<ActionResult<PagedList<ProductDto>>> GetPagedListAsync([FromQuery] ProductParams param)
    {
        var pagedList = await uow.ProductRepository.GetPagedListAsync(param, User);

        Response.AddPaginationHeader(new PaginationHeader(pagedList.CurrentPage, pagedList.PageSize,
            pagedList.TotalCount, pagedList.TotalPages));

        return pagedList;
    }

    [AllowAnonymous]
    [HttpGet("all")]
    public async Task<ActionResult<List<ProductDto>>> GetAllAsync([FromQuery] ProductParams param)
    {
        var data = await uow.ProductRepository.GetAllDtoAsync(param, User);
        
        return data;
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<ProductDto?>> GetByIdAsync([FromRoute]int id)
    {
        var item = await uow.ProductRepository.GetDtoByIdAsync(id);

        if (item == null) return NotFound($"{subjectArticle} {subject} de ID {id} no fue encontrado.");

        return item;
    }

    [HttpPut("{id}")]
    public async Task<ActionResult<ProductDto?>> UpdateAsync([FromRoute] int id, [FromBody] ProductUpdateDto request)
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
    
    [HttpGet("summary")]
    public async Task<ActionResult<List<ProductSummaryDto>>> GetSummaryAsync([FromQuery] ProductParams param)
    {
        var item = await uow.ProductRepository.GetSummaryDtosAsync(param, User);

        if (item == null) return NotFound($"{subjectArticle} {subject} no fue encontrado.");

        return item;
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

    [HttpPost]
    public async Task<ActionResult<ProductDto?>> CreateAsync([FromBody] ProductCreateDto request)
    {
        Product? itemExists = await uow.ProductRepository.GetByNameAsync(request.Name, User);

        if (itemExists != null)  return BadRequest($"{subjectArticle} {subject} de nombre '{request.Name}' ya existe para los servicios que ofreces.");

        AppUser? doctor = await userManager.Users
            .Include(x => x.DoctorProducts)
                .ThenInclude(x => x.Product)
            .SingleOrDefaultAsync(x => x.Id == User.GetUserId())
        ;

        if (doctor == null) return BadRequest($"Error al crear {subjectArticle} {subject}.");

        var item = mapper.Map<Product>(request);

        doctor.DoctorProducts.Add(new(item));

        await userManager.UpdateAsync(doctor);

        var itemToReturn = await uow.ProductRepository.GetDtoByIdAsync(item.Id);

        return itemToReturn;
    }
}
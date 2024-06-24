using AutoMapper;
using MainService.Core.DTOs.Medicines;
using MainService.Core.DTOs.Products;
using MainService.Core.Helpers.Pagination;
using MainService.Core.Helpers.Params;
using MainService.Core.Interfaces.Services;
using MainService.Errors;
using MainService.Extensions;
using MainService.Models.Entities;
using Microsoft.AspNetCore.Mvc;

namespace MainService.Controllers
{
    public class MedicinesController : BaseApiController
    {
        private readonly IUnitOfWork _uow;
        private readonly IMapper _mapper;

        public MedicinesController(IUnitOfWork unitOfWork, IMapper mapper)
        {
            _uow = unitOfWork;
            _mapper = mapper;
        }

        [HttpGet]
        public async Task<ActionResult<PagedList<ProductDto>>> GetPagedList([FromQuery] ProductParams param)
        {
            var pagedList = await _uow.ProductRepository.GetPagedListAsync(param);

            Response.AddPaginationHeader(
                new PaginationHeader(
                    pagedList.CurrentPage,
                    pagedList.PageSize,
                    pagedList.TotalCount,
                    pagedList.TotalPages
                )
            );

            return Ok(pagedList);
        }

        [HttpGet("all")]
        public async Task<ActionResult<List<Product>>> GetAllAsync()
        {
            var itemsToReturn = await _uow.ProductRepository.GetAllAsync();

            if (itemsToReturn.Count == 0) return NoContent();

            return itemsToReturn;
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<ProductDto>> GetByIdAsync([FromRoute] int id)
        {
            var item = await _uow.ProductRepository.GetByIdAsync(id);

            if (item == null)
                return NotFound(new ApiResponse(404, $"Cuerno con ID {id} no encontrado."));

            var itemToReturn = _mapper.Map<ProductDto>(item);
            return itemToReturn;
        }

        [HttpPost]
        public async Task<ActionResult<ProductDto>> AddAsync([FromBody] ProductCreateDto request)
        {
            var item = new Product();

            _mapper.Map<ProductCreateDto, Product>(request, item);

            _uow.ProductRepository.Add(item);

            if (!await _uow.Complete())
                return BadRequest(new ApiResponse(400, "Error al agregar el cuerno."));

            var itemToReturn = _mapper.Map<Product, ProductDto>(item);
            return itemToReturn;
        }

        [HttpPut("{id}")]
        public async Task<ActionResult<ProductDto>> UpdateAsync([FromRoute] int id, [FromBody] ProductUpdateDto request)
        {
            var item = await _uow.ProductRepository.GetByIdAsync(id);

            if (item == null) return NotFound(new ApiResponse(404, $"Cuerno con ID {id} no encontrado."));

            _mapper.Map<ProductUpdateDto, Product>(request, item);

            if (!await _uow.Complete())
                return BadRequest(new ApiResponse(400, $"Error al actualizar el cuerno con ID {id}."));

            var itemToReturn = await _uow.ProductRepository.GetDtoByIdAsync(id);
            var itemToReturnMapped = _mapper.Map<ProductDto, ProductDto>(itemToReturn);
            return itemToReturnMapped;
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult> DeleteByIdAsync([FromRoute] int id)
        {
            var item = await _uow.ProductRepository.GetByIdAsync(id);

            if (item == null)
                return NotFound(new ApiResponse(404, $"Cuerno con ID {id} no encontrado."));

            var deleteResult = await DeleteProductAsync(item, id);

            if (!deleteResult)
                return BadRequest(new ApiResponse(400, $"Error al eliminar el cuerno con ID {id}."));

            return NoContent();
        }

        [HttpDelete("range/{ids}")]
        public async Task<ActionResult> DeleteRangeAsync([FromRoute] string ids)
        {
            var selectedProductIds = ids.Split(',').Select(int.Parse).ToList();

            foreach (var id in selectedProductIds)
            {
                var item = await _uow.ProductRepository.GetByIdAsync(id);

                if (item == null) return NotFound(new ApiResponse(404, $"Cuerno con ID {id} no encontrado."));

                var deleteResult = await DeleteProductAsync(item, id);

                if (!deleteResult) return BadRequest(new ApiResponse(400, $"Error al eliminar el cuerno con ID {id}."));
            }

            return Ok();
        }

        private async Task<bool> DeleteProductAsync(Product item, int id)
        {
            var itemToDelete = await _uow.ProductRepository.GetByIdAsync(id);

            _uow.ProductRepository.Delete(itemToDelete);

            if (!await _uow.Complete()) return false;

            return true;
        }
    }
}
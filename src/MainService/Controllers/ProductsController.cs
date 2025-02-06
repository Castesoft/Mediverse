using AutoMapper;
using CloudinaryDotNet;
using CloudinaryDotNet.Actions;
using MainService.Core.Extensions;
using MainService.Core.DTOs.Products;
using MainService.Core.DTOs.WarehouseProduct;
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
using Serilog;
using Product = MainService.Models.Entities.Product;

namespace MainService.Controllers;

public class ProductsController(
    IUnitOfWork uow,
    IProductsService service,
    IMapper mapper,
    ICloudinaryService cloudinaryService,
    UserManager<AppUser> userManager) : BaseApiController
{
    private const string Subject = "producto";
    private const string SubjectArticle = "El";

    [HttpGet("options")]
    public async Task<ActionResult<List<OptionDto>>> GetOptionsAsync([FromQuery] ProductParams param)
    {
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

    [HttpGet("{id:int}")]
    public async Task<ActionResult<ProductDto?>> GetByIdAsync([FromRoute] int id)
    {
        var item = await uow.ProductRepository.GetDtoByIdAsync(id);

        if (item == null) return NotFound($"{SubjectArticle} {Subject} de ID {id} no fue encontrado.");

        return item;
    }
    
    [HttpPut("update-warehouses/{id:int}")]
    public async Task<ActionResult<ProductDto>> UpdateProductWarehouses(int id, [FromBody] ProductWarehouseUpdateDto updateDto)
    {
        var product = await uow.ProductRepository.GetByIdAsync(id);
        if (product == null)
            return NotFound($"Product with ID {id} not found.");

        var currentWarehouseIds = product.WarehouseProducts.Select(wp => wp.WarehouseId).ToList();

        var warehousesToAdd = updateDto.WarehouseIds.Except(currentWarehouseIds).ToList();
        var warehousesToRemove = currentWarehouseIds.Except(updateDto.WarehouseIds).ToList();

        foreach (var wid in warehousesToAdd)
        {
            product.WarehouseProducts.Add(new WarehouseProduct
            {
                ProductId = product.Id,
                WarehouseId = wid,
                
                Quantity = 0,
                ReservedQuantity = 0,
                DamagedQuantity = 0,
                OnHoldQuantity = 0,
                ReorderLevel = 0,
                SafetyStock = 0,
                LastUpdated = DateTime.UtcNow
            });
        }

        product.WarehouseProducts.RemoveAll(wp => warehousesToRemove.Contains(wp.WarehouseId));

        await uow.Complete();

        var updatedDto = mapper.Map<ProductDto>(product);
        return Ok(updatedDto);
    }


    [HttpPut("{id:int}")]
    public async Task<ActionResult<ProductDto>> UpdateAsync([FromRoute] int id, [FromForm] ProductUpdateDto request)
    {
        var item = await uow.ProductRepository.GetByIdAsync(id);
        if (item == null)
            return NotFound($"{SubjectArticle} {Subject} con ID {id} no fue encontrado.");

        if (request.Name != null) item.Name = request.Name;
        if (request.Description != null) item.Description = request.Description;
        if (request.Price.HasValue) item.Price = request.Price.Value;
        if (request.Discount.HasValue) item.Discount = request.Discount.Value;
        if (request.LotNumber != null) item.LotNumber = request.LotNumber;
        if (request.Unit != null) item.Unit = request.Unit;
        if (request.Dosage.HasValue) item.Dosage = request.Dosage.Value;
        if (request.Manufacturer != null) item.Manufacturer = request.Manufacturer;
        if (request.IsEnabled.HasValue) item.IsEnabled = request.IsEnabled.Value;
        if (request.IsVisible.HasValue) item.IsVisible = request.IsVisible.Value;
        if (request.SKU != null) item.SKU = request.SKU;
        if (request.Barcode != null) item.Barcode = request.Barcode;
        if (request.Category != null) item.Category = request.Category;
        if (request.CostPrice.HasValue) item.CostPrice = request.CostPrice.Value;

        Log.Information(request.IsEnabled.HasValue
                ? "Product {Name} is now {Status}. Value: {Value}"
                : "Product {Name} status remains unchanged. Current Value: {Value}",
            item.Name, item.IsEnabled ? "enabled" : "disabled", item.IsEnabled);

        Log.Information(request.IsVisible.HasValue
                ? "Product {Name} is now {Status}. Value: {Value}"
                : "Product {Name} visibility remains unchanged. Current Value: {Value}",
            item.Name, item.IsVisible ? "visible" : "hidden", item.IsVisible);
        if (request.RemovedImageIds != null && request.RemovedImageIds.Any())
        {
            var photosToRemove = item.ProductPhotos
                .Where(pp => request.RemovedImageIds.Contains(pp.PhotoId.ToString()))
                .ToList();

            foreach (var photo in photosToRemove)
            {
                if (!string.IsNullOrEmpty(photo.Photo.PublicId))
                {
                    await cloudinaryService.DeleteAsync(photo.Photo.PublicId);
                }

                item.ProductPhotos.Remove(photo);
                uow.PhotoRepository.Delete(photo.Photo);
            }
        }

        if (request.Files != null && request.Files.Count > 0)
        {
            foreach (var file in request.Files)
            {
                var uploadResult = await UploadImage(file);
                if (uploadResult != null)
                {
                    item.ProductPhotos.Add(new ProductPhoto(new Photo
                    {
                        Url = uploadResult.SecureUrl,
                        PublicId = uploadResult.PublicId,
                        Size = (int?)file.Length
                    }));
                }
            }
        }

        if (item.ProductPhotos.Count != 0)
        {
            var mainPhotoIndex = request.MainImageIndex;
            if (mainPhotoIndex >= 0 && mainPhotoIndex < item.ProductPhotos.Count)
            {
                foreach (var (photo, index) in item.ProductPhotos.Select((p, i) => (p, i)))
                {
                    photo.IsMain = index == mainPhotoIndex;
                }
            }
        }

        uow.ProductRepository.Update(item);

        if (!await uow.Complete())
        {
            return BadRequest($"Error al actualizar {SubjectArticle} {Subject} con ID {id}.");
        }

        var updatedItem = await uow.ProductRepository.GetDtoByIdAsync(id);
        if (updatedItem != null) return updatedItem;
        return BadRequest($"Error al recuperar el producto actualizado.");
    }


    [Authorize(Policy = "RequireAdminRole")]
    [HttpDelete("{id:int}")]
    public async Task<ActionResult> DeleteByIdAsync(int id)
    {
        var item = await uow.ProductRepository.GetByIdAsNoTrackingAsync(id);

        if (item == null) return NotFound($"{SubjectArticle} {Subject} de ID {id} no fue encontrado.");

        var deleteResult = await service.DeleteAsync(item);

        if (!deleteResult) return BadRequest($"Error al eliminar {Subject} de {item.Name}.");

        return Ok();
    }

    [HttpGet("summary")]
    public async Task<ActionResult<List<ProductSummaryDto>>> GetSummaryAsync([FromQuery] ProductParams param)
    {
        var item = await uow.ProductRepository.GetSummaryDtosAsync(param, User);

        if (item == null) return NotFound($"{SubjectArticle} {Subject} no fue encontrado.");

        return item;
    }

    [HttpDelete("range/{ids}")]
    public async Task<ActionResult> DeleteRangeAsync([FromRoute] string ids)
    {
        var selectedIds = ids.Split(',').Select(int.Parse).ToList();

        foreach (var item in selectedIds)
        {
            var itemToDelete = await uow.ProductRepository.GetByIdAsNoTrackingAsync(item);

            if (itemToDelete == null) return NotFound($"{SubjectArticle} {Subject} de ID {item} no fue encontrado.");

            var deleteResult = await service.DeleteAsync(itemToDelete);

            if (!deleteResult) return BadRequest($"Error al eliminar {Subject} de {itemToDelete.Id}.");
        }

        return Ok();
    }

    [HttpPost]
    public async Task<ActionResult<ProductDto>> CreateAsync([FromForm] ProductCreateDto request)
    {
        var itemExists = await uow.ProductRepository.GetByNameAsync(request.Name, User);
        if (itemExists != null)
            return BadRequest($"El producto de nombre '{request.Name}' ya existe.");

        var doctor = await userManager.Users
            .Include(x => x.DoctorProducts)
            .ThenInclude(x => x.Product)
            .SingleOrDefaultAsync(x => x.Id == User.GetUserId());

        if (doctor == null) return BadRequest("Error al crear el producto.");

        var item = new Product
        {
            Name = request.Name,
            Description = request.Description,
            Price = request.Price,
            Discount = request.Discount,
            LotNumber = request.LotNumber,
            Unit = request.Unit,
            Dosage = request.Dosage,
            Manufacturer = request.Manufacturer,
            SKU = request.SKU,
            Barcode = request.Barcode,
            Category = request.Category,
            CostPrice = request.CostPrice
        };

        if (request.IsEnabled.HasValue) item.IsEnabled = request.IsEnabled.Value;
        if (request.IsVisible.HasValue) item.IsVisible = request.IsVisible.Value;

        // Existing image upload logic.
        if (request.Files != null && request.Files.Count > 0)
        {
            foreach (var file in request.Files)
            {
                var uploadResult = await UploadImage(file);
                if (uploadResult != null)
                {
                    item.ProductPhotos.Add(new ProductPhoto(new Photo
                    {
                        Url = uploadResult.SecureUrl,
                        PublicId = uploadResult.PublicId,
                        Size = (int?)file.Length
                    }));
                }
            }

            if (item.ProductPhotos.Count != 0)
            {
                int mainImageIndex = request.MainImageIndex;

                if (mainImageIndex >= 0 && mainImageIndex < item.ProductPhotos.Count)
                {
                    foreach (var (photo, index) in item.ProductPhotos.Select((p, i) => (p, i)))
                    {
                        photo.IsMain = index == mainImageIndex;
                    }
                }
                else
                {
                    item.ProductPhotos.First().IsMain = true;
                }

                var mainPhoto = item.ProductPhotos.FirstOrDefault(p => p.IsMain);
                Log.Information(mainPhoto != null
                        ? "Main photo confirmed at index {Index}"
                        : "WARNING: No main photo set!",
                    item.ProductPhotos.ToList().IndexOf(mainPhoto!));
            }
        }

        uow.ProductRepository.Add(item);

        if (!request.IsInternal.HasValue || !request.IsInternal.Value)
            doctor.DoctorProducts.Add(new DoctorProduct(item));

        if (!await uow.Complete()) return BadRequest("Error al guardar el producto.");

        var itemToReturn = await uow.ProductRepository.GetDtoByIdAsync(item.Id);
        if (itemToReturn != null) return itemToReturn;

        return BadRequest($"Error al recuperar el {Subject} creado.");
    }

    private async Task<ImageUploadResult?> UploadImage(IFormFile file)
    {
        var fileName = Guid.NewGuid().ToString();
        var uploadParams = new ImageUploadParams
        {
            Folder = "Mediverse/Products",
            File = new FileDescription(fileName, file.OpenReadStream())
        };

        var uploadResult = await cloudinaryService.UploadAsync(file, uploadParams);
        return uploadResult.StatusCode == System.Net.HttpStatusCode.OK ? uploadResult : null;
    }
}
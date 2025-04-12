using AutoMapper;
using MainService.Authorization.Operations;
using MainService.Core.DTOs.Prescription;
using MainService.Core.Extensions;
using MainService.Core.Helpers.Pagination;
using MainService.Core.Helpers.Params;
using MainService.Core.Interfaces.Services;
using MainService.Extensions;
using MainService.Models.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace MainService.Controllers;

public class PrescriptionsController(
    IUnitOfWork uow,
    IPrescriptionsService service,
    IMapper mapper,
    IOrdersService ordersService,
    IAuthorizationService authorizationService) : BaseApiController
{
    private const string Subject = "receta";
    private const string SubjectArticle = "La";

    public async Task<ActionResult<PagedList<PrescriptionDto>>> GetPagedListAsync([FromQuery] PrescriptionParams param)
    {
        // Authorization is handled at the repository level through filters based on user roles and ID
        var pagedList = await uow.PrescriptionRepository.GetPagedListAsync(param, User);

        Response.AddPaginationHeader(new PaginationHeader(pagedList.CurrentPage, pagedList.PageSize,
            pagedList.TotalCount, pagedList.TotalPages));

        return pagedList;
    }

    [HttpGet("{id:int}")]
    public async Task<ActionResult<PrescriptionDto?>> GetByIdAsync([FromRoute] int id)
    {
        var item = await uow.PrescriptionRepository.GetByIdAsync(id);

        if (item == null) return NotFound($"{SubjectArticle} {Subject} de ID {id} no fue encontrado.");

        var authResult = await authorizationService.AuthorizeAsync(User, item, PrescriptionOperations.Read);
        if (!authResult.Succeeded) return Forbid();

        var itemDto = await uow.PrescriptionRepository.GetDtoByIdAsync(id);
        return itemDto;
    }

    [HttpPut("{id:int}")]
    public async Task<ActionResult<PrescriptionDto?>> UpdateAsync([FromRoute] int id,
        [FromBody] PrescriptionUpdateDto request)
    {
        var item = await uow.PrescriptionRepository.GetByIdAsync(id);

        if (item == null) return NotFound($"{SubjectArticle} {Subject} con ID {id} no fue encontrado.");

        var authResult = await authorizationService.AuthorizeAsync(User, item, PrescriptionOperations.Update);
        if (!authResult.Succeeded) return Forbid();

        mapper.Map(request, item);

        if (!await uow.Complete()) return BadRequest($"Error al actualizar {SubjectArticle} {Subject} con ID {id}.");

        var itemToReturn = await uow.PrescriptionRepository.GetDtoByIdAsync(id);
        return itemToReturn;
    }

    [HttpPost]
    public async Task<ActionResult<PrescriptionDto?>> CreateAsync([FromBody] PrescriptionCreateDto request)
    {
        var authResult =
            await authorizationService.AuthorizeAsync(User, new Prescription(), PrescriptionOperations.Create);
        if (!authResult.Succeeded) return Forbid();

        if (!request.Date.HasValue)
            return BadRequest("La fecha es requerida");

        if (request.Patient?.Id == null)
            return BadRequest("El paciente es requerido");

        if (request.Clinic?.Id == null)
            return BadRequest("La clínica es requerida");

        if (string.IsNullOrEmpty(request.Notes))
            return BadRequest("Las notas son requeridas");

        if (request.Items.Count == 0)
            return BadRequest("Los medicamentos son requeridos");

        var doctorId = User.GetUserId();
        var patientId = request.Patient.Id.Value;
        var clinicId = request.Clinic.Id.Value;

        if (!await uow.UserRepository.ExistsByIdAsync(patientId))
            return NotFound($"El paciente con Id {patientId} no existe");

        if (!await uow.PatientRepository.ExistsAsync(patientId, doctorId))
            return BadRequest($"El paciente {patientId} no corresponde al doctor {doctorId}.");

        if (request.EventId.HasValue)
        {
            var @event = await uow.EventRepository.GetByIdAsNoTrackingAsync(request.EventId.Value);
            if (@event == null) return NotFound($"La cita con Id {request.EventId} no existe");

            if (!await uow.EventRepository.DoctorHasEventAsync(doctorId, request.EventId.Value))
                return BadRequest($"La cita {request.EventId.Value} no corresponde al doctor {doctorId}.");
        }

        if (!await uow.AddressRepository.ExistsByIdAsync(clinicId))
            return NotFound($"La clínica con Id {clinicId} no existe");

        if (!await uow.AddressRepository.DoctorHasAddressAsync(doctorId, clinicId))
            return BadRequest($"La clínica {clinicId} no corresponde al doctor {doctorId}.");

        var patient = await uow.UserRepository.GetByIdAsNoTrackingAsync(patientId);
        if (patient == null) return NotFound($"Paciente {patientId} no existe");

        var prescriptionToCreate = new Prescription
        {
            Date = request.Date.Value,
            Notes = request.Notes,
            ExchangeAmount = request.ExchangeAmount,
            PatientPrescription = new PatientPrescription(patientId),
            DoctorPrescription = new DoctorPrescription(doctorId),
            PrescriptionClinic = new PrescriptionClinic(clinicId)
        };

        if (request.EventId.HasValue)
            prescriptionToCreate.EventPrescription = new EventPrescription(request.EventId.Value);

        List<OrderProduct> globalProducts = [];

        foreach (var item in request.Items)
        {
            if (item.Product?.Id == null) return BadRequest("El medicamento es requerido");

            var productId = item.Product.Id.Value;

            if (!await uow.ProductRepository.ExistsByIdAsync(productId))
                return NotFound($"Producto {productId} no existe");

            var product = await uow.ProductRepository.GetByIdAsNoTrackingAsync(productId);
            if (product == null) return NotFound($"Producto {productId} no existe");

            if (await uow.ProductRepository.DoctorHasProductAsync(doctorId, productId))
            {
                var prescriptionProduct = BuildPrescriptionProduct(item, product);
                prescriptionToCreate.PrescriptionItems.Add(prescriptionProduct);
            }
            else if (await uow.ProductRepository.IsGlobalAsync(productId))
            {
                var orderProduct = BuildOrderProduct(item, product);
                globalProducts.Add(orderProduct);

                var prescriptionProduct = BuildPrescriptionProduct(item, product);
                prescriptionToCreate.PrescriptionItems.Add(prescriptionProduct);
            }
        }

        uow.PrescriptionRepository.Add(prescriptionToCreate);

        if (globalProducts.Count != 0)
        {
            var order = await ordersService.CreateAsync(globalProducts, patientId, doctorId);

            if (order?.OrderDeliveryAddress?.AddressId == 0)
            {
                order.OrderDeliveryAddress = null;
            }

            if (order != null)
            {
                order.PrescriptionOrder = new PrescriptionOrder(prescriptionToCreate);
                uow.OrderRepository.Add(order);
            }
        }

        if (uow.HasChanges() && !await uow.Complete()) return BadRequest($"Error al crear {SubjectArticle} {Subject}.");

        return await uow.PrescriptionRepository.GetDtoByIdAsync(prescriptionToCreate.Id);
    }

    private static PrescriptionProduct BuildPrescriptionProduct(PrescriptionItemCreateDto item, Product product) =>
        new()
        {
            Instructions = string.IsNullOrEmpty(item.Instructions) ? null : item.Instructions,
            Quantity = item.Quantity,
            Dosage = product.Dosage,
            ProductId = product.Id,
            Unit = product.Unit,
            Name = product.Name
        };

    private static OrderProduct BuildOrderProduct(PrescriptionItemCreateDto item, Product product) => new()
    {
        Quantity = item.Quantity,
        Instructions = string.IsNullOrEmpty(item.Instructions) ? null : item.Instructions,
        ProductId = product.Id,
        Dosage = product.Dosage,
        Unit = product.Unit,
        Price = product.Price,
        Discount = product.Discount,
        Product = product
    };

    [HttpDelete("{id:int}")]
    public async Task<ActionResult> DeleteByIdAsync(int id)
    {
        var item = await uow.PrescriptionRepository.GetByIdAsync(id);

        if (item == null) return NotFound($"{SubjectArticle} {Subject} de ID {id} no fue encontrado.");

        var authResult = await authorizationService.AuthorizeAsync(User, item, PrescriptionOperations.Delete);
        if (!authResult.Succeeded) return Forbid();

        var deleteResult = await service.DeleteAsync(item);

        if (!deleteResult) return BadRequest($"Error al eliminar {Subject} con Id: {item.Id}.");

        return Ok();
    }

    [HttpDelete("range/{ids}")]
    public async Task<ActionResult> DeleteRangeAsync([FromRoute] string ids)
    {
        var selectedIds = ids.Split(',').Select(int.Parse).ToList();

        foreach (var item in selectedIds)
        {
            var itemToDelete = await uow.PrescriptionRepository.GetByIdAsync(item);

            if (itemToDelete == null) return NotFound($"{SubjectArticle} {Subject} de ID {item} no fue encontrado.");

            var authResult =
                await authorizationService.AuthorizeAsync(User, itemToDelete, PrescriptionOperations.Delete);
            if (!authResult.Succeeded) return Forbid();

            var deleteResult = await service.DeleteAsync(itemToDelete);

            if (!deleteResult) return BadRequest($"Error al eliminar {Subject} de {itemToDelete.Id}.");
        }

        return Ok();
    }
}
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
using Serilog;

namespace MainService.Controllers;

public class PrescriptionsController(
    IUnitOfWork uow,
    IPrescriptionsService service,
    IMapper mapper,
    IOrdersService ordersService,
    IAuthorizationService authorizationService,
    IEmailService emailService,
    IConfiguration configuration)
    : BaseApiController
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

        if (request.Items == null || request.Items.Count == 0)
            return BadRequest("Los medicamentos son requeridos");

        var doctorId = User.GetUserId();
        var patientId = request.Patient.Id.Value;
        var clinicId = request.Clinic.Id.Value;

        if (!await uow.UserRepository.ExistsByIdAsync(patientId))
            return NotFound($"El paciente con Id {patientId} no existe");

        var patient = await uow.UserRepository.GetByIdAsync(patientId);
        if (patient == null)
        {
            Log.Error("Failed to retrieve patient entity for ID {PatientId} after existence check passed.", patientId);
            return NotFound($"El paciente con Id {patientId} no pudo ser cargado.");
        }

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
        {
            prescriptionToCreate.EventPrescription = new EventPrescription(request.EventId.Value);
        }

        List<OrderProduct> globalProducts = [];

        foreach (var item in request.Items)
        {
            if (item.Product?.Id == null) return BadRequest("El ID del medicamento es requerido en cada item.");

            var productId = item.Product.Id.Value;

            if (!await uow.ProductRepository.ExistsByIdAsync(productId))
                return NotFound($"Producto {productId} no existe");

            var product = await uow.ProductRepository.GetByIdAsNoTrackingAsync(productId);
            if (product == null) return NotFound($"Producto {productId} no existe (falló la carga).");


            var prescriptionProduct = BuildPrescriptionProduct(item, product);
            prescriptionToCreate.PrescriptionItems.Add(prescriptionProduct);


            bool isDoctorProduct = await uow.ProductRepository.DoctorHasProductAsync(doctorId, productId);


            if (!isDoctorProduct && await uow.ProductRepository.IsGlobalAsync(productId))
            {
                var orderProduct = BuildOrderProduct(item, product);
                globalProducts.Add(orderProduct);
            }
            else if (!isDoctorProduct)
            {
                Log.Warning(
                    "Product ID {ProductId} is neither assigned to Doctor ID {DoctorId} nor marked as global. Skipping for order.",
                    productId, doctorId);
            }
        }

        if (prescriptionToCreate.PrescriptionItems.Count == 0)
        {
            return BadRequest("No se agregaron productos válidos a la receta.");
        }


        uow.PrescriptionRepository.Add(prescriptionToCreate);


        Order? createdOrder = null;
        bool orderWasCreated = false;

        if (globalProducts.Count > 0)
        {
            Log.Information("Creating order for Prescription with {Count} global products.", globalProducts.Count);

            createdOrder = await ordersService.CreateAsync(globalProducts, patientId, doctorId);

            if (createdOrder != null)
            {
                createdOrder.PrescriptionOrder = new PrescriptionOrder(prescriptionToCreate);

                uow.OrderRepository.Add(createdOrder);
                orderWasCreated = true;
                Log.Information("Order object prepared for saving, linked to Prescription.");
            }
            else
            {
                Log.Warning(
                    "OrdersService.CreateAsync returned null when attempting to create an order for Prescription (before saving). Patient ID: {PatientId}",
                    patientId);
            }
        }


        if (!uow.HasChanges())
        {
            Log.Information(
                "No changes detected in Unit of Work before saving Prescription for Patient ID {PatientId}. Order creation status: {OrderWasCreated}",
                patientId, orderWasCreated);
        }

        Log.Information(
            "Attempting to save changes for Prescription and potentially Order (OrderCreated: {OrderWasCreated}).",
            orderWasCreated);
        if (!await uow.Complete())
        {
            Log.Error("Failed to save changes to the database for Prescription/Order creation. Patient ID: {PatientId}",
                patientId);
            return BadRequest($"Error al crear {SubjectArticle} {Subject}. Fallo al guardar cambios.");
        }

        Log.Information(
            "Successfully saved changes. Prescription ID: {PrescriptionId}, Order ID (if created): {OrderId}",
            prescriptionToCreate.Id, createdOrder?.Id ?? 0);


        if (orderWasCreated && createdOrder != null && createdOrder.Id > 0)
        {
            Log.Information("Order ID {OrderId} was created and saved. Proceeding to send payment request email.",
                createdOrder.Id);
            try
            {
                var fullOrderDetails = await uow.OrderRepository.GetOrderWithItemsAndProductsAsync(createdOrder.Id);


                if (fullOrderDetails != null && patient != null && !string.IsNullOrEmpty(patient.Email))
                {
                    var paymentBaseUrl =
                        configuration["ClientSettings:PaymentUrl"];
                    if (string.IsNullOrEmpty(paymentBaseUrl))
                    {
                        Log.Error(
                            "ClientSettings:PaymentUrl is not configured in appsettings. Cannot generate payment link for Order ID {OrderId}.",
                            createdOrder.Id);
                    }
                    else
                    {
                        var paymentUrl = $"{paymentBaseUrl.TrimEnd('/')}/{fullOrderDetails.Id}";
                        Log.Information("Generated Payment URL: {PaymentUrl} for Order ID {OrderId}", paymentUrl,
                            createdOrder.Id);


                        await emailService.SendOrderPaymentRequestEmailAsync(patient, fullOrderDetails, paymentUrl);

                        Log.Information("Payment request email sending initiated for Order ID {OrderId} to {Email}.",
                            createdOrder.Id, patient.Email);
                    }
                }
                else
                {
                    if (fullOrderDetails == null)
                        Log.Warning(
                            "Could not send payment request email for Order ID {OrderId}: Failed to retrieve full order details after save.",
                            createdOrder.Id);
                    if (patient == null)
                        Log.Warning(
                            "Could not send payment request email for Order ID {OrderId}: Patient object was null.",
                            createdOrder.Id);
                    if (patient != null && string.IsNullOrEmpty(patient.Email))
                        Log.Warning(
                            "Could not send payment request email for Order ID {OrderId}: Patient email is missing. Patient ID: {PatientId}",
                            createdOrder.Id, patient.Id);
                }
            }
            catch (Exception ex)
            {
                Log.Error(ex,
                    "An unexpected error occurred while attempting to prepare or send payment request email for Order ID {OrderId}",
                    createdOrder.Id);
            }
        }
        else if (orderWasCreated && (createdOrder == null || createdOrder.Id == 0))
        {
            Log.Warning(
                "Order creation was flagged but the resulting Order object is null or has no ID after saving. Order ID reference: {OrderId}. Email not sent.",
                createdOrder?.Id ?? 0);
        }


        var createdPrescriptionDto = await uow.PrescriptionRepository.GetDtoByIdAsync(prescriptionToCreate.Id);
        if (createdPrescriptionDto == null)
        {
            Log.Error(
                "Failed to retrieve PrescriptionDto for newly created Prescription ID {PrescriptionId} immediately after successful save.",
                prescriptionToCreate.Id);

            return StatusCode(StatusCodes.Status500InternalServerError,
                "Receta creada pero ocurrió un error al recuperar sus detalles.");
        }


        if (createdOrder != null && createdOrder.Id > 0)
        {
            createdPrescriptionDto.OrderId = createdOrder.Id;
        }

        return createdPrescriptionDto;
    }


    private static PrescriptionProduct BuildPrescriptionProduct(PrescriptionItemCreateDto item, Product product) =>
        new()
        {
            Instructions = string.IsNullOrEmpty(item.Instructions) ? null : item.Instructions.Trim(),
            Quantity = item.Quantity ?? 1,
            Dosage = product.Dosage,
            ProductId = product.Id,
            Unit = product.Unit,
            Name = product.Name
        };


    private static OrderProduct BuildOrderProduct(PrescriptionItemCreateDto item, Product product) => new()
    {
        Quantity = item.Quantity ?? 1,
        Instructions = string.IsNullOrEmpty(item.Instructions) ? null : item.Instructions.Trim(),
        ProductId = product.Id,
        Dosage = product.Dosage,
        Unit = product.Unit,
        Price = product.Price,
        Discount = product.Discount,
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
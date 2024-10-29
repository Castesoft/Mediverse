#nullable enable

using AutoMapper;
using MainService.Core.DTOs.Prescription;
using MainService.Core.Extensions;
using MainService.Core.Helpers.Pagination;
using MainService.Core.Helpers.Params;
using MainService.Core.Interfaces.Services;
using MainService.Extensions;
using MainService.Models.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Serilog;

namespace MainService.Controllers;

public class PrescriptionsController(
    IUnitOfWork uow,
    IPrescriptionsService service,
    IMapper mapper,
    // UserManager<AppUser> userManager,
    IOrdersService ordersService
) : BaseApiController
{
    private static readonly string subject = "receta";
    private static readonly string subjectArticle = "La";

    public async Task<ActionResult<PagedList<PrescriptionDto>>> GetPagedListAsync([FromQuery] PrescriptionParams param)
    {
        var pagedList = await uow.PrescriptionRepository.GetPagedListAsync(param, User);

        Response.AddPaginationHeader(new PaginationHeader(pagedList.CurrentPage, pagedList.PageSize,
            pagedList.TotalCount, pagedList.TotalPages));

        return pagedList;
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<PrescriptionDto>> GetByIdAsync([FromRoute]int id)
    {
        var item = await uow.PrescriptionRepository.GetDtoByIdAsync(id);

        if (item == null) return NotFound($"{subjectArticle} {subject} de ID {id} no fue encontrado.");

        return item;
    }

    [HttpPut("{id}")]
    public async Task<ActionResult<PrescriptionDto>> UpdateAsync([FromRoute] int id, [FromBody] PrescriptionUpdateDto request)
    {
        var item = await uow.PrescriptionRepository.GetByIdAsync(id);

        if (item == null) return NotFound($"{subjectArticle} {subject} con ID {id} no fue encontrado.");

        mapper.Map(request, item);

        if (!await uow.Complete()) return BadRequest($"Error al actualizar {subjectArticle} {subject} con ID {id}.");

        var itemToReturn = await uow.PrescriptionRepository.GetDtoByIdAsync(id);
        return itemToReturn;
    }

    [HttpPost]
    public async Task<ActionResult<PrescriptionDto?>> CreateAsync(
        [FromBody] PrescriptionCreateDto request
    )
    {
        int doctorId = User.GetUserId();
        
        if (request.Patient == null)
        return BadRequest("El paciente es requerido");

        if (string.IsNullOrEmpty(request.Notes))
        return BadRequest("Las notas son requeridas");

        if (!await uow.UserRepository.ExistsByIdAsync(request.Patient.Id))
        return NotFound($"El paciente con Id {request.Patient.Id} no existe");
        
        if (!await uow.UserRepository.PatientExistsAsync(request.Patient.Id, doctorId))
        return BadRequest($"El paciente {request.Patient.Id} no corresponde al doctor {doctorId}.");
        
        if (request.Event != null) {
            if (!await uow.EventRepository.ExistsByIdAsync(request.Event.Id))
            return NotFound($"La cita con Id {request.Event.Id} no existe");

            if (!await uow.EventRepository.DoctorHasEventAsync(doctorId, request.Event.Id))
            return BadRequest($"La cita {request.Event.Id} no corresponde al doctor {doctorId}.");
        }

        if (request.Clinic == null)
        return BadRequest("La clínica es requerida");

        if (!await uow.AddressRepository.ExistsByIdAsync(request.Clinic.Id))
        return NotFound($"La clínica con Id {request.Clinic.Id} no existe");

        if (!await uow.AddressRepository.DoctorHasAddressAsync(doctorId, request.Clinic.Id))
        return BadRequest($"La clínica {request.Clinic.Id} no corresponde al doctor {doctorId}.");

        if (request.Items.Count() == 0)
        return BadRequest("Los medicamentos son requeridos");

        int patientId = request.Patient.Id;
        int clinicId = request.Clinic.Id;
        string notes = request.Notes;

        AppUser? patient = await uow.UserRepository.GetByIdAsNoTrackingAsync(patientId);

        if (patient == null) return NotFound($"Paciente {patientId} no existe");

        Prescription prescriptionToCreate = new();

        if (request.ExchangeAmount.HasValue) prescriptionToCreate.ExchangeAmount = request.ExchangeAmount.Value;
        prescriptionToCreate.Notes = notes;
        prescriptionToCreate.PatientPrescription = new(patientId);
        prescriptionToCreate.DoctorPrescription = new(doctorId);
        if (request.Event != null) prescriptionToCreate.EventPrescription = new(request.Event.Id);

        List<OrderItem> globalProducts = [];

        foreach (PrescriptionItemCreateDto item in request.Items)
        {
            if (!await uow.ProductRepository.ExistsByIdAsync(item.Product.Id))
            return NotFound($"Producto {item.Product.Id} no existe");

            if (await uow.ProductRepository.DoctorHasProductAsync(doctorId, item.Product.Id)) {
                prescriptionToCreate.PrescriptionItems.Add(new PrescriptionItem {
                    ItemId = item.Product.Id,
                    Dosage = item.Dosage,
                    Quantity = item.Quantity,
                    Instructions = item.Instructions,
                });
            } else if (await uow.ProductRepository.IsGlobalAsync(item.Product.Id)) {
                globalProducts.Add(new OrderItem
                {
                    Quantity = item.Quantity,
                    Dosage = item.Dosage,
                    Instructions = item.Instructions,
                    Unit = item.Unit,
                    ItemId = item.Product.Id,
                });
            }
        }

        if (globalProducts.Count() > 0) {
            Order order = await ordersService.CreateAsync(globalProducts, patientId, doctorId);

            prescriptionToCreate.PrescriptionOrder = new(order);

            uow.OrderRepository.Add(order);
        }

        uow.PrescriptionRepository.Add(prescriptionToCreate);

        if (!await uow.Complete()) return BadRequest("Error al crear la receta.");

        return await uow.PrescriptionRepository.GetDtoByIdAsync(prescriptionToCreate.Id);
    }

    [HttpDelete("{id}")]
    public async Task<ActionResult> DeleteByIdAsync(int id)
    {
        var item = await uow.PrescriptionRepository.GetByIdAsNoTrackingAsync(id);

        if (item == null) return NotFound($"{subjectArticle} {subject} de ID {id} no fue encontrado.");

        var deleteResult = await service.DeleteAsync(item);

        if (!deleteResult) return BadRequest($"Error al eliminar {subject} con Id: {item.Id}.");

        return Ok();
    }

    [HttpDelete("range/{ids}")]
    public async Task<ActionResult> DeleteRangeAsync([FromRoute]string ids)
    {   
        var selectedIds = ids.Split(',').Select(int.Parse).ToList();

        foreach (var item in selectedIds)
        {
            var itemToDelete = await uow.PrescriptionRepository.GetByIdAsNoTrackingAsync(item);

            if (itemToDelete == null) return NotFound($"{subjectArticle} {subject} de ID {item} no fue encontrado.");

            var deleteResult = await service.DeleteAsync(itemToDelete);

            if (!deleteResult) return BadRequest($"Error al eliminar {subject} de {itemToDelete.Id}.");
        }
        
        return Ok();
    }
}
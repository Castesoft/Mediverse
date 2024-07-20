using AutoMapper;
using MainService.Core.DTOs.Prescription;
using MainService.Core.Extensions;
using MainService.Core.DTOs.Prescription;
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
    IMapper mapper,
    UserManager<AppUser> userManager) : BaseApiController
{
    [HttpPost("{doctorId}")]
    public async Task<ActionResult<PrescriptionDto>> CreateAsync([FromRoute] int doctorId,
        [FromBody] PrescriptionCreateDto request)
    {
        Log.Information("Request: {@request}, DoctorId: {@doctorId}", request, doctorId);
        if (request == null)
        {
            return BadRequest("Invalid request payload");
        }

        var patient = await userManager.FindByIdAsync(request.PatientId.ToString());

        if (patient == null) return NotFound("El paciente no existe");

        Event eventItem = null;

        if (request.EventId != null)
        {
            eventItem = await uow.EventRepository.GetByIdAsync(request.EventId.Value);
            if (eventItem == null) return NotFound("La cita no existe");
            if (eventItem.PatientEvent.PatientId != request.PatientId)
                return BadRequest("La cita no corresponde al paciente");
        }

        var newPrescription = new Prescription
        {
            DoctorPrescription = new DoctorPrescription
            {
                DoctorId = User.GetUserId()
            },
            ExchangeAmount = request.ExchangeAmount ?? 1,
            PrescriptionItems = new List<PrescriptionItem>()
        };

        foreach (var item in request.PrescriptionItems)
        {
            var product = await uow.ProductRepository.GetByIdAsync(item.ProductId);
            if (product == null) return NotFound($"Producto {item.ProductId} no existe");

            newPrescription.PrescriptionItems.Add(new PrescriptionItem
            {
                ItemId = product.Id,
                Dosage = item.Dosage,
                Quantity = item.Quantity,
                Instructions = item.Instructions,
                Notes = item.Notes,
            });
        }

        if (eventItem != null)
        {
            newPrescription.EventPrescription = new EventPrescription
            {
                Event = eventItem
            };
        }

        patient.PatientPrescriptions.Add(new PatientPrescription()
        {
            Prescription = newPrescription,
        });

        uow.PrescriptionRepository.Add(newPrescription);

        await uow.Complete();

        return await uow.PrescriptionRepository.GetDtoByIdAsync(newPrescription.Id);
    }
}
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
    IPrescriptionsService service,
    IMapper mapper,
    UserManager<AppUser> userManager) : BaseApiController
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

    // [HttpPut("{id}")]
    // public async Task<ActionResult<PrescriptionDto>> UpdateAsync([FromRoute] int id, [FromBody] PrescriptionUpdateDto request)
    // {
    //     var item = await uow.PrescriptionRepository.GetByIdAsync(id);

    //     if (item == null) return NotFound($"{subjectArticle} {subject} con ID {id} no fue encontrado.");

    //     mapper.Map(request, item);

    //     if (!await uow.Complete()) return BadRequest($"Error al actualizar {subjectArticle} {subject} con ID {id}.");

    //     var itemToReturn = await uow.PrescriptionRepository.GetDtoByIdAsync(id);
    //     return itemToReturn;
    // }

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

        var foreignItems = new List<OrderItem>();

        foreach (var item in request.PrescriptionItems)
        {
            var product = await uow.ProductRepository.GetByIdAsync(item.ProductId);
            if (product == null) return NotFound($"Producto {item.ProductId} no existe");

            if (product.DoctorProduct?.DoctorId != doctorId)
            {
                foreignItems.Add(new OrderItem
                {
                    Quantity = item.Quantity,
                    Dosage = product.Dosage.ToString(),
                    Instructions = item.Instructions,
                    Notes = item.Notes,
                    Unit = product.Unit,
                    Item = product
                });
            }

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

        if (foreignItems.Count > 0)
        {
            var order = await CreateOrder(foreignItems);

            order.PrescriptionOrder = new PrescriptionOrder
            {
                Prescription = newPrescription
            };

            patient.PatientOrders.Add(new PatientOrder
            {
                Order = order
            });

            order.DoctorOrder = new DoctorOrder
            {
                DoctorId = User.GetUserId()
            };

            var patientAddress = patient.UserAddresses.FirstOrDefault(x => x.IsMain);

            if (patientAddress != null)
            {
                order.OrderAddress = new OrderAddress
                {
                    Address = patientAddress.Address,
                };
            }

            uow.OrderRepository.Add(order);
        }

        uow.PrescriptionRepository.Add(newPrescription);

        await uow.Complete();

        return await uow.PrescriptionRepository.GetDtoByIdAsync(newPrescription.Id);
    }

    private async Task<Order> CreateOrder(List<OrderItem> orderItems)
    {
        var order = new Order
        {
            Total = 0,
            Subtotal = 0,
            Discount = 0,
            Tax = 0,
            AmountPaid = 0,
            AmountDue = 0,
            PrescriptionOrder = null,
            PatientOrder = null,
            DoctorOrder = null,
            OrderAddress = null,
            OrderItems = new List<OrderItem>(),
            Status = OrderStatus.Pending,
            DeliveryStatus = OrderDeliveryStatus.Processing
        };

        foreach (var orderItem in orderItems)
        {
            order.OrderItems.Add(orderItem);
            order.Subtotal += orderItem.Price * orderItem.Quantity;
            order.Tax += order.Subtotal * (decimal)0.16;
            order.Total = order.Subtotal + order.Tax;
        }

        return order;
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
}
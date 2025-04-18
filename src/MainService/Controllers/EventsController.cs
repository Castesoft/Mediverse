using System.Globalization;
using AutoMapper;
using MainService.Core.Helpers.Pagination;
using MainService.Core.Helpers.Params;
using MainService.Core.Interfaces.Services;
using MainService.Core.Extensions;
using MainService.Extensions;
using MainService.Models.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using MainService.Core.DTOs.Events;
using MainService.Core.DTOs.Notification;
using MainService.Core.DTOs.Payment;
using MainService.Hubs;
using MainService.Models.Helpers;
using Microsoft.AspNetCore.SignalR;
using MainService.Authorization.Operations;
using MainService.Models.Enums;
using Serilog;

namespace MainService.Controllers;

[Authorize]
public class EventsController(
    IUnitOfWork uow,
    IEventsService service,
    UserManager<AppUser> userManager,
    IEmailService emailService,
    IStripeService stripeService,
    INotificationsService notificationsService,
    IMapper mapper,
    IHubContext<NotificationHub> hubContext,
    IUsersService usersService,
    IAuthorizationService authService
)
    : BaseApiController
{
    private const string Subject = "cita";
    private const string SubjectArticle = "La";
    private const int CommissionInCents = 5 * 100;

    [HttpGet]
    public async Task<ActionResult<PagedList<EventDto>>> GetPagedListAsync([FromQuery] EventParams param)
    {
        var userId = User.GetUserId();

        if (!await uow.UserRepository.ExistsByIdAsync(userId))
        {
            return BadRequest("Usuario no encontrado.");
        }

        param.AuthenticatedUserId = userId;
        var pagedList = await uow.EventRepository.GetPagedListAsync(param);

        Response.AddPaginationHeader(new PaginationHeader(
            pagedList.CurrentPage,
            pagedList.PageSize,
            pagedList.TotalCount,
            pagedList.TotalPages
        ));

        return pagedList;
    }

    [HttpGet("doctor-fields")]
    [Authorize(Roles = "Doctor")]
    public async Task<ActionResult<EventDoctorFieldsDto>> GetDoctorFieldsAsync()
    {
        var item = await uow.EventRepository.GetDoctorFieldsDtoAsync(User);
        if (item == null)
        {
            return NotFound($"{SubjectArticle} {Subject} no fue encontrado.");
        }

        return item;
    }

    [HttpGet("{id:int}")]
    public async Task<ActionResult<EventDto?>> GetByIdAsync([FromRoute] int id)
    {
        var userId = User.GetUserId();

        var eventResource = await uow.EventRepository.GetByIdAsNoTrackingAsync(id);
        if (eventResource == null)
        {
            return NotFound($"{SubjectArticle} {Subject} de ID {id} no fue encontrado.");
        }

        var authorizationResult = await authService.AuthorizeAsync(User, eventResource, EventOperations.Read);
        if (!authorizationResult.Succeeded)
        {
            return Forbid();
        }

        var item = await uow.EventRepository.GetDtoByIdAsync(id);
        if (item != null)
        {
            return item;
        }

        Log.Error("GetByIdAsync: Event DTO for {EventId} is null after resource found and authorization succeeded.",
            id);
        return NotFound($"{SubjectArticle} {Subject} de ID {id} no fue encontrado.");
    }

    [HttpGet("summary")]
    public async Task<ActionResult<List<EventSummaryDto>>> GetSummaryAsync([FromQuery] EventParams param)
    {
        var userId = User.GetUserId();
        param.DoctorId = userId;

        var item = await uow.EventRepository.GetSummaryDtosAsync(param);
        return item;
    }

    [HttpDelete("range/{ids}")]
    public async Task<ActionResult> DeleteRangeAsync([FromRoute] string ids)
    {
        if (string.IsNullOrWhiteSpace(ids))
        {
            return BadRequest("No event IDs provided.");
        }

        List<int> selectedIds;
        try
        {
            selectedIds = ids.Split(',').Select(int.Parse).ToList();
        }
        catch (FormatException ex)
        {
            Log.Error(ex, "Invalid format for event IDs: {EventIds}", ids);
            return BadRequest("Invalid format for event IDs.");
        }

        foreach (var eventId in selectedIds)
        {
            var itemToDelete = await uow.EventRepository.GetByIdAsync(eventId);
            if (itemToDelete == null)
            {
                continue;
            }

            var authorizationResult = await authService.AuthorizeAsync(User, itemToDelete, EventOperations.Delete);
            if (!authorizationResult.Succeeded)
            {
                return Forbid($"No tienes permiso para eliminar el evento con ID {eventId}.");
            }

            var deleteResult = await service.DeleteAsync(itemToDelete);
            if (!deleteResult)
            {
                return BadRequest($"Error al intentar eliminar el evento con ID {eventId} a través del servicio.");
            }
        }

        if (!await uow.Complete())
        {
            return BadRequest("Error saving deletions.");
        }

        return Ok();
    }

    [HttpGet("month-partial")]
    public async Task<ActionResult<List<EventMonthDayCellDto>>> GetMonthViewPartialAsync([FromQuery] EventParams param)
    {
        var userId = User.GetUserId();
        param.AuthenticatedUserId = userId;

        var list = await uow.EventRepository.GetMonthViewPartialAsync(param);
        return Ok(list);
    }

    [HttpPost("search")]
    public async Task<ActionResult<EventDto?>> PatientCreateAsync([FromBody] PatientCreateEventDto request)
    {
        var userId = User.GetUserId();
        Event eventToCreate = new();

        var patientFromRepo = await uow.UserRepository.GetByIdAsync(userId);
        if (patientFromRepo == null)
        {
            return BadRequest($"Usuario de ID {userId} no fue encontrado.");
        }

        if (request.Doctor == null)
        {
            return BadRequest("Doctor es requerido.");
        }

        if (!request.Doctor.Id.HasValue)
        {
            return BadRequest("El doctor es requerido.");
        }

        var doctorFromRepo = await uow.UserRepository.GetByIdAsync(request.Doctor.Id.Value);
        if (doctorFromRepo == null)
        {
            return BadRequest($"Doctor de ID {request.Doctor.Id} no fue encontrado.");
        }

        var doctorUserRoles = await userManager.GetRolesAsync(doctorFromRepo);
        if (doctorUserRoles == null || !doctorUserRoles.Contains("Doctor"))
        {
            return BadRequest($"El usuario con ID {request.Doctor.Id} no tiene el rol de doctor.");
        }

        if (request.Service == null)
        {
            return BadRequest("El servicio es requerido.");
        }

        if (!request.Service.Id.HasValue)
        {
            return BadRequest("El servicio es requerido.");
        }

        var serviceFromRepo = await uow.ServiceRepository.GetByIdAsync(request.Service.Id.Value);
        if (serviceFromRepo == null)
        {
            return BadRequest($"El servicio con ID {request.Service.Id.Value} no fue encontrado.");
        }

        if (serviceFromRepo.DoctorService == null || serviceFromRepo.DoctorService.DoctorId != request.Doctor.Id.Value)
        {
            return BadRequest($"Servicio de ID {request.Service.Id.Value} no fue encontrado para el doctor actual.");
        }

        if (request.Clinic == null)
        {
            return BadRequest("La clinica es requerida.");
        }

        if (!request.Clinic.Id.HasValue)
        {
            return BadRequest("La clinica es requerida.");
        }

        var clinicFromRepo = await uow.AddressRepository.GetByIdAsync(request.Clinic.Id.Value);
        if (clinicFromRepo == null)
        {
            return BadRequest($"La clinica de ID {request.Clinic.Id.Value} no fue encontrada.");
        }

        if (clinicFromRepo.DoctorClinic == null || clinicFromRepo.DoctorClinic.DoctorId != request.Doctor.Id.Value)
        {
            return BadRequest($"La clinica de ID {request.Clinic.Id.Value} no fue encontrada para el doctor actual.");
        }

        if (request.PaymentMethodType == null)
        {
            return BadRequest("El método de pago es requerido.");
        }

        if (!request.PaymentMethodType.Id.HasValue)
        {
            return BadRequest("El método de pago es requerido.");
        }

        var paymentMethodTypeFromRepo =
            await uow.PaymentMethodTypeRepository.GetByIdAsync(request.PaymentMethodType.Id.Value);
        if (paymentMethodTypeFromRepo == null)
        {
            return BadRequest($"Método de pago de ID {request.PaymentMethodType.Id.Value} no fue encontrado.");
        }

        if (request.MedicalInsuranceCompany != null)
        {
            if (!request.MedicalInsuranceCompany.Id.HasValue)
            {
                return BadRequest("Compañía de seguro médico es requerida.");
            }

            var insuranceCompanyFromRepo =
                await uow.MedicalInsuranceCompanyRepository.GetByIdAsync(request.MedicalInsuranceCompany.Id.Value);
            if (insuranceCompanyFromRepo == null)
            {
                return BadRequest(
                    $"Compañía de seguro médico de ID {request.MedicalInsuranceCompany.Id.Value} no fue encontrada.");
            }

            var isAssociatedWithDoctor = insuranceCompanyFromRepo.DoctorMedicalInsuranceCompanies
                .Any(x => x.DoctorId == request.Doctor.Id.Value);

            if (!isAssociatedWithDoctor)
            {
                return BadRequest(
                    $"Compañía de seguro médico de ID {request.MedicalInsuranceCompany.Id.Value} no fue encontrada para el doctor actual.");
            }

            eventToCreate.EventMedicalInsuranceCompany =
                new EventMedicalInsuranceCompany(request.MedicalInsuranceCompany.Id.Value);
        }

        if (!request.DateFrom.HasValue)
        {
            return BadRequest("La fecha de inicio es requerida.");
        }

        if (!request.DateTo.HasValue)
        {
            return BadRequest("La fecha de fin es requerida.");
        }

        if (string.IsNullOrEmpty(request.TimeFrom))
        {
            return BadRequest("La hora de inicio es requerida.");
        }

        if (string.IsNullOrEmpty(request.TimeTo))
        {
            return BadRequest("La hora de fin es requerida.");
        }

        if (!await service.IsDoctorAvailableAsync(request.Doctor.Id.Value, request.DateFrom.Value,
                request.DateTo.Value))
        {
            return BadRequest("El doctor no está disponible en el horario seleccionado.");
        }

        var serviceNoTracking =
            await uow.ServiceRepository.GetByIdAsNoTrackingAsync(request.Service.Id.Value);

        if ((request.PaymentMethodType.Id.Value == 1 || request.PaymentMethodType.Id.Value == 2) &&
            doctorFromRepo.RequireAnticipatedCardPayments.HasValue &&
            doctorFromRepo.RequireAnticipatedCardPayments.Value)
        {
            if (string.IsNullOrEmpty(request.StripePaymentMethodId))
            {
                return BadRequest("StripePaymentMethodId es requerido para el pago anticipado.");
            }

            if (string.IsNullOrEmpty(doctorFromRepo.StripeConnectAccountId))
            {
                var (account, accountLinkUrl) = await stripeService.CreateExpressAccountAsync(doctorFromRepo);
                if (!await usersService.UpdateStripeConnectAccountId(doctorFromRepo.Id, account.Id))
                {
                    return BadRequest("Error al actualizar la cuenta de Stripe del doctor.");
                }
            }

            if (!string.IsNullOrEmpty(patientFromRepo.StripeCustomerId) &&
                !string.IsNullOrEmpty(doctorFromRepo.StripeConnectAccountId) &&
                !string.IsNullOrEmpty(request.StripePaymentMethodId))
            {
                var amountInCents = serviceNoTracking.Price * 100;
                var paymentIntent = await stripeService.CreatePaymentIntentAsync(
                    patientFromRepo.StripeCustomerId,
                    request.StripePaymentMethodId,
                    doctorFromRepo.StripeConnectAccountId,
                    amountInCents,
                    CommissionInCents
                );

                if (paymentIntent == null)
                {
                    return BadRequest("Error al procesar el pago.");
                }

                if (paymentIntent.Status != "succeeded")
                {
                    return BadRequest("Error al procesar el pago. Intente con otro método de pago.");
                }
            }
            else
            {
                return BadRequest("Error al procesar el pago. Intente con otro método de pago.");
            }
        }

        if (!await usersService.AddPatientToDoctorAsync(doctorFromRepo.Id, patientFromRepo.Id))
        {
            return BadRequest("Error al agregar el paciente al doctor.");
        }

        eventToCreate.DateFrom = request.DateFrom.Value.Add(TimeSpan.Parse(request.TimeFrom));
        eventToCreate.DateTo = request.DateTo.Value.Add(TimeSpan.Parse(request.TimeTo));
        eventToCreate.PatientEvent = new PatientEvent(userId);
        eventToCreate.DoctorEvent = new DoctorEvent(request.Doctor.Id.Value);
        eventToCreate.EventService = new EventService(request.Service.Id.Value);
        eventToCreate.EventClinic = new EventClinic(request.Clinic.Id.Value);

        eventToCreate.PaymentStatus = PaymentStatus.AwaitingPayment;

        if (request.MedicalInsuranceCompany?.Id.HasValue ?? false)
        {
            eventToCreate.EventMedicalInsuranceCompany =
                new EventMedicalInsuranceCompany(request.MedicalInsuranceCompany.Id.Value);
        }

        if (request.PaymentMethodType?.Id.HasValue ?? false)
        {
            eventToCreate.EventPaymentMethodType = new EventPaymentMethodType(request.PaymentMethodType.Id.Value);
        }

        uow.EventRepository.Add(eventToCreate);

        if (!await uow.Complete())
        {
            return BadRequest($"Error al crear {Subject}.");
        }

        if (doctorFromRepo != null && serviceNoTracking != null)
        {
            var marketingSuccess = await ProcessEventMarketingAsync(
                eventToCreate,
                doctorFromRepo,
                patientFromRepo,
                serviceNoTracking,
                eventToCreate.DateFrom.Value,
                eventToCreate.DateTo.Value
            );

            if (!marketingSuccess)
            {
                Log.Warning("Marketing/Notification processing failed for Event {EventId}", eventToCreate.Id);
            }

            if (!await uow.Complete())
            {
                return BadRequest("Error al guardar notificaciones.");
            }
        }

        var createdDto = await uow.EventRepository.GetDtoByIdAsync(eventToCreate.Id);
        if (createdDto == null)
        {
            return NotFound("Cita creada pero no se pudo recuperar la información detallada.");
        }

        return Ok(createdDto);
    }

    [HttpPost("{id:int}/pay")]
    public async Task<ActionResult> PayForEventAsync([FromRoute] int id, [FromBody] PaymentRequestDto request)
    {
        var userId = User.GetUserId();

        var eventItem = await uow.EventRepository.GetByIdAsync(id);
        if (eventItem == null) return NotFound($"Event with ID {id} not found.");

        var authorizationResult = await authService.AuthorizeAsync(User, eventItem, EventOperations.Pay);
        if (!authorizationResult.Succeeded) return Forbid("You are not authorized to pay for this event.");

        var paymentMethod = await uow.PaymentMethodRepository.GetByIdAsync(request.PaymentMethodId);
        if (paymentMethod == null) return BadRequest("Payment method not found.");

        if (paymentMethod.UserId != userId)
            return Forbid("Payment method does not belong to the current user.");

        var patientStripeCustomerId = paymentMethod.User?.StripeCustomerId;
        if (string.IsNullOrEmpty(patientStripeCustomerId))
            return BadRequest("Patient does not have a Stripe customer account.");

        var doctorStripeAccountId = eventItem.DoctorEvent?.Doctor?.StripeConnectAccountId;
        if (string.IsNullOrEmpty(doctorStripeAccountId))
            return BadRequest("Doctor does not have a Stripe Connect account.");

        var serviceEntity = await uow.ServiceRepository.GetByIdAsync(eventItem.EventService.ServiceId);
        if (serviceEntity == null) return BadRequest("Service not found for event.");

        var amountInCents = serviceEntity.Price * 100;
        if (string.IsNullOrEmpty(paymentMethod.StripePaymentMethodId))
            return BadRequest("The selected PaymentMethod does not have a Stripe PaymentMethodId.");

        var paymentIntent = await stripeService.CreatePaymentIntentAsync(
            patientStripeCustomerId, paymentMethod.StripePaymentMethodId, doctorStripeAccountId, amountInCents,
            CommissionInCents
        );
        if (paymentIntent == null)
            return BadRequest("Error processing payment.");

        if (paymentIntent.Status != "succeeded" && paymentIntent.Status != "processing")
            return BadRequest($"Payment failed with status: {paymentIntent.Status}. Please try again.");

        var status = Utils.MapStripeStatusToPaymentStatus(paymentIntent.Status);
        var payment = new Payment
        {
            Amount = serviceEntity.Price,
            Currency = "MXN",
            Date = DateTime.UtcNow,
            PaymentStatus = status,
            StripePaymentIntent = paymentIntent.Id,
            EventId = eventItem.Id,
            PaymentMethodId = paymentMethod.Id,
            PaymentProcessingMode = PaymentProcessingMode.Integrated
        };

        eventItem.Payments.Add(payment);
        uow.PaymentRepository.Add(payment);

        if (!await uow.Complete()) return BadRequest("Error saving payment details.");

        return Ok(new { PaymentIntentId = paymentIntent.Id, Status = paymentIntent.Status });
    }

    [HttpPost]
    [Authorize(Roles = "Doctor, Nurse, Patient, Admin")]
    public async Task<ActionResult<EventDto?>> CreateAsync([FromBody] EventCreateDto request)
    {
        if (request.DateFrom == default || request.DateTo == default)
            return BadRequest("Las fechas de inicio y fin son requeridas.");

        var currentUser = await uow.UserRepository.GetByIdAsync(User.GetUserId());
        if (currentUser == null) return BadRequest($"Usuario de ID {User.GetUserId()} no fue encontrado.");

        var patient = await uow.UserRepository.GetByIdAsync(request.PatientId);
        if (patient == null) return BadRequest($"Paciente de ID {request.PatientId} no fue encontrado.");

        var serviceEntity = await uow.ServiceRepository.GetByIdAsync(request.ServiceId);
        if (serviceEntity == null) return BadRequest($"Tratamiento de ID {request.ServiceId} no fue encontrado.");

        var clinicEntity = await uow.AddressRepository.GetByIdAsync(request.ClinicId);
        if (clinicEntity == null) return BadRequest($"Clínica de ID {request.ClinicId} no fue encontrada.");

        AppUser? doctor;
        var userRoles = await userManager.GetRolesAsync(currentUser);
        if (userRoles.Contains("Doctor"))
        {
            doctor = currentUser;
        }
        else if (request.DoctorId.HasValue && request.DoctorId.Value > 0)
        {
            doctor = await uow.UserRepository.GetByIdAsync(request.DoctorId.Value);
            if (doctor == null)
                return BadRequest($"Doctor de ID {request.DoctorId.Value} no fue encontrado.");
        }
        else
        {
            return BadRequest("El doctor es requerido para la creación de la cita.");
        }

        var isAvailable = await service.IsDoctorAvailableAsync(doctor.Id, request.DateFrom, request.DateTo);
        if (!isAvailable)
            return BadRequest("El doctor no está disponible en el horario seleccionado.");

        if (userRoles.Contains("Doctor"))
        {
            // TODO - Payment logic if needed
        }
        else
        {
            var doctorPatient = doctor.Patients.FirstOrDefault(p => p.PatientId == patient.Id);
            if (doctorPatient == null)
            {
                if (!request.HasPatientInformationAccess.HasValue)
                    return BadRequest("El acceso a la información del paciente es requerido.");

                doctor.Patients.Add(new DoctorPatient(doctor.Id, patient.Id)
                {
                    HasClinicalHistoryAccess = request.HasPatientInformationAccess.Value
                });
            }
            else if (request.HasPatientInformationAccess.HasValue)
            {
                doctorPatient.HasClinicalHistoryAccess = request.HasPatientInformationAccess.Value;
            }
        }

        var nurseEvents = new List<NurseEvent>();
        if (request.NurseIds != null && request.NurseIds.Any())
        {
            foreach (var nurseId in request.NurseIds)
            {
                if (nurseId <= 0)
                    return BadRequest("El ID de la enfermera debe ser un valor positivo.");

                var nurseEntity = await uow.UserRepository.GetByIdAsync(nurseId);
                if (nurseEntity == null) return BadRequest($"Enfermera de ID {nurseId} no fue encontrada.");

                nurseEvents.Add(new NurseEvent(nurseEntity.Id));
            }
        }

        var newEvent = new Event
        {
            AllDay = request.AllDay,
            DateFrom = request.DateFrom,
            DateTo = request.DateTo,
            EventService = new EventService(request.ServiceId),
            PatientEvent = new PatientEvent(patient.Id),
            EventClinic = new EventClinic(request.ClinicId),
            DoctorEvent = new DoctorEvent(doctor)
        };

        if (request.PaymentMethodTypeId.HasValue)
            newEvent.EventPaymentMethodType = new EventPaymentMethodType(request.PaymentMethodTypeId.Value);

        if (request.MedicalInsuranceCompanyId.HasValue)
            newEvent.EventMedicalInsuranceCompany =
                new EventMedicalInsuranceCompany(request.MedicalInsuranceCompanyId.Value);

        uow.EventRepository.Add(newEvent);

        if (!await uow.Complete()) return BadRequest("Error al crear el evento.");

        var marketingSuccess = await ProcessEventMarketingAsync(
            newEvent,
            doctor,
            patient,
            serviceEntity,
            newEvent.DateFrom.Value,
            newEvent.DateTo.Value
        );

        if (!marketingSuccess)
            return BadRequest("Error al enviar confirmación de cita.");

        if (!await uow.Complete())
            return BadRequest("Error al guardar notificaciones.");

        return await uow.EventRepository.GetDtoByIdAsync(newEvent.Id);
    }

    [HttpPut("{id:int}")]
    public async Task<ActionResult<EventDto?>> UpdateAsync([FromRoute] int id, [FromBody] EventUpdateDto request)
    {
        var item = await uow.EventRepository.GetByIdAsync(id);
        if (item == null)
            return NotFound($"{SubjectArticle} {Subject} de ID {id} no fue encontrado.");

        var authorizationResult = await authService.AuthorizeAsync(User, item, EventOperations.Update);
        if (!authorizationResult.Succeeded) return Forbid();

        if (request.Evolution != null) item.Evolution = request.Evolution;
        if (request.NextSteps != null) item.NextSteps = request.NextSteps;

        if (uow.HasChanges())
        {
            if (!await uow.Complete())
                return BadRequest($"Error al actualizar {Subject}.");
        }

        var itemDto = await uow.EventRepository.GetDtoByIdAsync(item.Id);
        return Ok(itemDto);
    }

    [HttpPut("{id:int}/evolution")]
    public async Task<ActionResult<EventDto?>> UpdateEvolutionAsync([FromRoute] int id,
        [FromBody] EventUpdateEvolutionDto request)
    {
        var userId = User.GetUserId();

        var item = await uow.EventRepository.GetByIdAsync(id);
        if (item == null)
            return NotFound($"{SubjectArticle} {Subject} de ID {id} no fue encontrado.");

        var authorizationResult = await authService.AuthorizeAsync(User, item, EventOperations.UpdateEvolution);
        if (!authorizationResult.Succeeded)
            return Forbid();

        if (request.Content == null) return BadRequest("El contenido de la evolución no puede ser nulo.");

        item.Evolution = request.Content;

        if (uow.HasChanges())
        {
            if (!await uow.Complete())
                return BadRequest($"Error al actualizar {Subject}.");
        }

        var itemDto = await uow.EventRepository.GetDtoByIdAsync(item.Id);
        return Ok(itemDto);
    }

    [HttpPut("{id:int}/next-steps")]
    public async Task<ActionResult<EventDto?>> UpdateNextStepAsync([FromRoute] int id,
        [FromBody] EventUpdateNextStepDto request)
    {
        var item = await uow.EventRepository.GetByIdAsync(id);
        if (item == null) return NotFound($"{SubjectArticle} {Subject} de ID {id} no fue encontrado.");

        var authorizationResult = await authService.AuthorizeAsync(User, item, EventOperations.UpdateNextSteps);
        if (!authorizationResult.Succeeded) return Forbid();

        if (request.Content == null) return BadRequest("El contenido de los siguientes pasos no puede ser nulo.");

        item.NextSteps = request.Content;

        if (uow.HasChanges())
        {
            if (!await uow.Complete()) return BadRequest($"Error al actualizar {Subject}.");
        }

        var itemDto = await uow.EventRepository.GetDtoByIdAsync(item.Id);
        return Ok(itemDto);
    }

    [HttpPut("{id:int}/cancel")]
    public async Task<ActionResult<EventDto>> CancelEventAsync([FromRoute] int id)
    {
        var userId = User.GetUserId();
        var eventItem = await uow.EventRepository.GetByIdAsync(id);

        if (eventItem == null)
        {
            return NotFound($"{SubjectArticle} {Subject} de ID {id} no fue encontrado.");
        }

        var authorizationResult = await authService.AuthorizeAsync(User, eventItem, EventOperations.Cancel);
        if (!authorizationResult.Succeeded)
        {
            Log.Warning("User {UserId} failed authorization check to cancel Event {EventId}.", userId, id);
            return Forbid();
        }


        if (eventItem.PaymentStatus == PaymentStatus.Canceled)
        {
            return BadRequest("La cita ya está cancelada.");
        }

        eventItem.PaymentStatus = PaymentStatus.Canceled;
        eventItem.AmountDue = 0;

        if (!await uow.Complete())
        {
            Log.Error("Failed to save cancellation for Event {EventId}", id);
            return BadRequest("Error al guardar la cancelación de la cita.");
        }

        var updatedDto = await uow.EventRepository.GetDtoByIdAsync(id);
        if (updatedDto == null)
        {
            Log.Error("Failed to retrieve DTO after cancelling Event {EventId}", id);
            return NotFound("Cita cancelada pero no se pudo recuperar la información actualizada.");
        }

        var doctor = await uow.UserRepository.GetByIdAsync(eventItem.DoctorEvent.DoctorId);
        var patient = await uow.UserRepository.GetByIdAsync(eventItem.PatientEvent.PatientId);
        var serviceEntity = await uow.ServiceRepository.GetByIdAsync(eventItem.EventService.ServiceId);

        if (doctor != null && patient != null && serviceEntity != null)
        {
            var marketingSuccess = await ProcessEventMarketingAsync(
                eventItem,
                doctor,
                patient,
                serviceEntity,
                eventItem.DateFrom ?? DateTime.MinValue,
                eventItem.DateTo ?? DateTime.MinValue,
                isCancellation: true
            );

            if (!marketingSuccess)
            {
                Log.Warning("Failed to send cancellation notifications for Event {EventId}", id);
            }

            if (!await uow.Complete())
            {
                Log.Error("Failed to save notification changes after cancelling Event {EventId}", id);
            }
        }
        else
        {
            Log.Warning(
                "Could not retrieve Doctor, Patient, or Service details for cancellation notification of Event {EventId}",
                id);
        }


        return Ok(updatedDto);
    }

    private async Task<bool> ProcessEventMarketingAsync(Event? eventItem, AppUser? doctor, AppUser? patient, dynamic serviceEntity, DateTime dateFrom, DateTime dateTo, bool isCancellation = false)
    {
        if (eventItem == null) {
            Log.Error("Event is null in ProcessEventMarketingAsync for Event {EventId}", eventItem?.Id);
            return false;
        }

        if (doctor == null) {
            Log.Error("Doctor is null in ProcessEventMarketingAsync for Event {EventId}", eventItem?.Id);
            return false;
        }

        if (patient == null) {
            Log.Error("Patient is null in ProcessEventMarketingAsync for Event {EventId}", eventItem?.Id);
            return false;
        }

        if (serviceEntity == null) {
            Log.Error("ServiceEntity is null in ProcessEventMarketingAsync for Event {EventId}", eventItem?.Id);
            return false;
        }

        try
        {
            var formattedDate = dateFrom.ToString("dd/MM/yyyy", CultureInfo.InvariantCulture);
            var doctorName = $"{doctor.FirstName} {doctor.LastName}";

            var appointmentTime = $"{dateFrom:HH:mm} - {dateTo:HH:mm}";
            string serviceName = serviceEntity.Name ?? "Consulta";
            if (string.IsNullOrEmpty(serviceEntity.Name))
            {
                Log.Warning("Service name is missing for Event {EventId}", eventItem.Id);
            }

            if (isCancellation)
            {
                const string cancelEmailSubject = "DocHub | Cancelación de cita";
                var cancelHtmlMessage = emailService.CreateAppointmentCancellationEmail(doctorName, formattedDate, appointmentTime, serviceName);
                var patientEmail = patient.Email;
                if (!string.IsNullOrEmpty(patientEmail))
                {
                    await emailService.SendMail(patientEmail, cancelEmailSubject, cancelHtmlMessage);
                }
                else
                {
                    Log.Warning("Patient email is missing for cancellation notification of event ID {EventId}",
                        eventItem.Id);
                }

                var patientCancelNotification =
                    await notificationsService.CreateForPatientEventCancellation(eventItem, patient);
                if (patientCancelNotification != null)
                {
                    await uow.UserNotificationRepository.AddAsync(patientCancelNotification);
                    await NotifyUserAsync(patient.Id, mapper.Map<NotificationDto>(patientCancelNotification));
                }


                var doctorCancelNotification =
                    await notificationsService.CreateForDoctorEventCancellation(eventItem, doctor);
                if (doctorCancelNotification != null)
                {
                    await uow.UserNotificationRepository.AddAsync(doctorCancelNotification);
                    await NotifyUserAsync(doctor.Id, mapper.Map<NotificationDto>(doctorCancelNotification));
                }
            }
            else
            {
                const string confirmEmailSubject = "DocHub | Confirmación de cita";
                var confirmHtmlMessage = emailService.CreateAppointmentConfirmationEmail(
                    doctorName, formattedDate, appointmentTime, serviceName, eventItem.Id
                );

                var patientEmail = patient.Email;
                if (!string.IsNullOrEmpty(patientEmail))
                {
                    await emailService.SendMail(patientEmail, confirmEmailSubject, confirmHtmlMessage);
                }
                else
                {
                    Log.Warning("Patient email is missing for confirmation of event ID {EventId}", eventItem.Id);
                }

                var patientConfirmNotification =
                    await notificationsService.CreateForPatientEventConfirmation(eventItem, patient);
                if (patientConfirmNotification != null)
                {
                    await uow.UserNotificationRepository.AddAsync(patientConfirmNotification);
                    await NotifyUserAsync(patient.Id, mapper.Map<NotificationDto>(patientConfirmNotification));
                }

                var doctorConfirmNotification =
                    await notificationsService.CreateForDoctorEventConfirmation(eventItem, doctor);
                if (doctorConfirmNotification != null)
                {
                    await uow.UserNotificationRepository.AddAsync(doctorConfirmNotification);
                    await NotifyUserAsync(doctor.Id, mapper.Map<NotificationDto>(doctorConfirmNotification));
                }
            }

            return true;
        }
        catch (Exception ex)
        {
            Log.Error(ex, "Error during ProcessEventMarketingAsync for Event {EventId}", eventItem.Id);
            return false;
        }
    }

    private async Task NotifyUserAsync(int userId, NotificationDto notification)
    {
        try
        {
            await hubContext.Clients.User(userId.ToString()).SendAsync("ReceiveNotification", notification);
        }
        catch (Exception ex)
        {
            Log.Error(ex, "Failed to send SignalR notification to User {UserId}", userId);
        }
    }
}
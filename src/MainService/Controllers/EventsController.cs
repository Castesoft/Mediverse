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
    IUsersService usersService) : BaseApiController
{
    private const string Subject = "cita";
    private const string SubjectArticle = "La";
    private const int CommissionInCents = 5 * 100;

    [HttpGet]
    public async Task<ActionResult<PagedList<EventDto>>> GetPagedListAsync([FromQuery] EventParams param)
    {
        if (param.IsCalendarView.HasValue && param.IsCalendarView.Value)
        {
            var list = await uow.EventRepository.GetAllDtoAsync(param);
            return Ok(list);
        }

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
    public async Task<ActionResult<EventDoctorFieldsDto>> GetDoctorFieldsAsync()
    {
        var item = await uow.EventRepository.GetDoctorFieldsDtoAsync(User);

        if (item == null) return NotFound($"{SubjectArticle} {Subject} no fue encontrado.");

        return item;
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<EventDto?>> GetByIdAsync([FromRoute] int id)
    {
        var item = await uow.EventRepository.GetDtoByIdAsync(id);

        if (item == null) return NotFound($"{SubjectArticle} {Subject} de ID {id} no fue encontrado.");

        return item;
    }

    [HttpGet("summary")]
    public async Task<ActionResult<List<EventSummaryDto>>> GetSummaryAsync([FromQuery] EventParams param)
    {
        param.DoctorId = User.GetUserId();

        var item = await uow.EventRepository.GetSummaryDtosAsync(param);

        if (item == null) return NotFound($"{SubjectArticle} {Subject} no fue encontrado.");

        return item;
    }

    [HttpDelete("range/{ids}")]
    public async Task<ActionResult> DeleteRangeAsync([FromRoute] string ids)
    {
        var selectedIds = ids.Split(',').Select(int.Parse).ToList();

        foreach (var item in selectedIds)
        {
            var itemToDelete = await uow.EventRepository.GetByIdAsNoTrackingAsync(item);

            if (itemToDelete == null) return NotFound($"{SubjectArticle} {Subject} de ID {item} no fue encontrado.");

            var deleteResult = await service.DeleteAsync(itemToDelete);
        }

        return Ok();
    }

    [HttpGet("month-partial")]
    public async Task<ActionResult<List<EventMonthDayCellDto>>> GetMonthViewPartialAsync([FromQuery] EventParams param)
    {
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
            return BadRequest($"Usuario de ID {userId} no fue encontrado.");

        if (request.Doctor == null)
            return BadRequest("Doctor es requerido.");
        if (!request.Doctor.Id.HasValue)
            return BadRequest("El doctor es requerido.");

        var doctorFromRepo = await uow.UserRepository.GetByIdAsync(request.Doctor.Id.Value);
        if (doctorFromRepo == null)
            return BadRequest($"Doctor de ID {request.Doctor.Id} no fue encontrado.");

        var doctorUserRoles = await userManager.GetRolesAsync(doctorFromRepo);
        if (doctorUserRoles == null || !doctorUserRoles.Contains("Doctor"))
            return BadRequest($"El usuario con ID {request.Doctor.Id} no tiene el rol de doctor.");

        if (request.Service == null)
            return BadRequest("El servicio es requerido.");
        if (!request.Service.Id.HasValue)
            return BadRequest("El servicio es requerido.");

        var serviceFromRepo = await uow.ServiceRepository.GetByIdAsync(request.Service.Id.Value);
        if (serviceFromRepo == null)
            return BadRequest($"El servicio con ID {request.Service.Id.Value} no fue encontrado.");
        if (serviceFromRepo.DoctorService == null || serviceFromRepo.DoctorService.DoctorId != request.Doctor.Id.Value)
            return BadRequest($"Servicio de ID {request.Service.Id.Value} no fue encontrado para el doctor actual.");

        if (request.Clinic == null)
            return BadRequest("La clinica es requerida.");
        if (!request.Clinic.Id.HasValue)
            return BadRequest("La clinica es requerida.");

        var clinicFromRepo = await uow.AddressRepository.GetByIdAsync(request.Clinic.Id.Value);
        if (clinicFromRepo == null)
            return BadRequest($"La clinica de ID {request.Clinic.Id.Value} no fue encontrada.");
        if (clinicFromRepo.DoctorClinic == null || clinicFromRepo.DoctorClinic.DoctorId != request.Doctor.Id.Value)
            return BadRequest($"La clinica de ID {request.Clinic.Id.Value} no fue encontrada para el doctor actual.");

        if (request.PaymentMethodType == null)
            return BadRequest("El método de pago es requerido.");
        if (!request.PaymentMethodType.Id.HasValue)
            return BadRequest("El método de pago es requerido.");

        var paymentMethodTypeFromRepo =
            await uow.PaymentMethodTypeRepository.GetByIdAsync(request.PaymentMethodType.Id.Value);
        if (paymentMethodTypeFromRepo == null)
            return BadRequest($"Método de pago de ID {request.PaymentMethodType.Id.Value} no fue encontrado.");

        if (request.MedicalInsuranceCompany != null)
        {
            if (!request.MedicalInsuranceCompany.Id.HasValue)
                return BadRequest("Compañía de seguro médico es requerida.");

            var insuranceCompanyFromRepo =
                await uow.MedicalInsuranceCompanyRepository.GetByIdAsync(request.MedicalInsuranceCompany.Id.Value);
            if (insuranceCompanyFromRepo == null)
                return BadRequest(
                    $"Compañía de seguro médico de ID {request.MedicalInsuranceCompany.Id.Value} no fue encontrada.");

            var isAssociatedWithDoctor = insuranceCompanyFromRepo.DoctorMedicalInsuranceCompanies
                .Any(x => x.DoctorId == request.Doctor.Id.Value);

            if (!isAssociatedWithDoctor)
                return BadRequest(
                    $"Compañía de seguro médico de ID {request.MedicalInsuranceCompany.Id.Value} no fue encontrada para el doctor actual.");

            eventToCreate.EventMedicalInsuranceCompany =
                new EventMedicalInsuranceCompany(request.MedicalInsuranceCompany.Id.Value);
        }

        if (!request.DateFrom.HasValue)
            return BadRequest("La fecha de inicio es requerida.");
        if (!request.DateTo.HasValue)
            return BadRequest("La fecha de fin es requerida.");
        if (string.IsNullOrEmpty(request.TimeFrom))
            return BadRequest("La hora de inicio es requerida.");
        if (string.IsNullOrEmpty(request.TimeTo))
            return BadRequest("La hora de fin es requerida.");

        if (!await service.IsDoctorAvailableAsync(request.Doctor.Id.Value, request.DateFrom.Value,
                request.DateTo.Value))
            return BadRequest("El doctor no está disponible en el horario seleccionado.");

        var doctor = await uow.UserRepository.GetByIdAsync(request.Doctor.Id.Value);
        if (doctor == null)
            return BadRequest($"Doctor de ID {request.Doctor.Id.Value} no fue encontrado.");

        var patient = await uow.UserRepository.GetByIdAsync(userId);
        if (patient == null)
            return BadRequest($"Usuario de ID {userId} no fue encontrado.");

        var serviceNoTracking = await uow.ServiceRepository.GetByIdAsNoTrackingAsync(request.Service.Id.Value);
        if (serviceNoTracking == null)
            return BadRequest($"Tratamiento de ID {request.Service.Id.Value} no fue encontrado.");

        if ((request.PaymentMethodType.Id.Value == 1 || request.PaymentMethodType.Id.Value == 2) &&
            doctor.RequireAnticipatedCardPayments.HasValue &&
            doctor.RequireAnticipatedCardPayments.Value)
        {
            if (string.IsNullOrEmpty(request.StripePaymentMethodId))
                return BadRequest("StripePaymentMethodId es requerido para el pago anticipado.");

            if (string.IsNullOrEmpty(doctor.StripeConnectAccountId))
            {
                var (account, accountLinkUrl) = await stripeService.CreateExpressAccountAsync(doctor);
                if (!await usersService.UpdateStripeConnectAccountId(doctor.Id, account.Id))
                    return BadRequest("Error al actualizar la cuenta de Stripe del doctor.");
            }

            if (!string.IsNullOrEmpty(patient.StripeCustomerId) &&
                !string.IsNullOrEmpty(doctor.StripeConnectAccountId) &&
                !string.IsNullOrEmpty(request.StripePaymentMethodId))
            {
                var amountInCents = serviceNoTracking.Price * 100;
                var paymentIntent = await stripeService.CreatePaymentIntentAsync(
                    patient.StripeCustomerId,
                    request.StripePaymentMethodId,
                    doctor.StripeConnectAccountId,
                    amountInCents,
                    CommissionInCents
                );

                if (paymentIntent == null)
                    return BadRequest("Error al procesar el pago.");
                if (paymentIntent.Status != "succeeded")
                    return BadRequest("Error al procesar el pago. Intente con otro método de pago.");
            }
            else
            {
                return BadRequest("Error al procesar el pago. Intente con otro método de pago.");
            }
        }

        if (!await usersService.AddPatientToDoctorAsync(doctor.Id, patient.Id))
            return BadRequest("Error al agregar el paciente al doctor.");

        eventToCreate.DateFrom = request.DateFrom.Value.Add(TimeSpan.Parse(request.TimeFrom));
        eventToCreate.DateTo = request.DateTo.Value.Add(TimeSpan.Parse(request.TimeTo));

        eventToCreate.PatientEvent = new PatientEvent(userId);
        eventToCreate.DoctorEvent = new DoctorEvent(request.Doctor.Id.Value);
        eventToCreate.EventService = new EventService(request.Service.Id.Value);
        eventToCreate.EventClinic = new EventClinic(request.Clinic.Id.Value);

        uow.EventRepository.Add(eventToCreate);

        if (!await uow.Complete())
            return BadRequest($"Error al crear {Subject}.");

        var marketingSuccess = await ProcessEventMarketingAsync(
            eventToCreate,
            doctor,
            patient,
            serviceNoTracking,
            request.DateFrom.Value,
            request.DateTo.Value
        );

        if (!marketingSuccess)
            return BadRequest("Error al enviar confirmación de cita.");

        if (!await uow.Complete())
            return BadRequest("Error al guardar notificaciones.");

        return await uow.EventRepository.GetDtoByIdAsync(eventToCreate.Id);
    }


    [HttpPost("{id:int}/pay")]
    public async Task<ActionResult> PayForEventAsync([FromRoute] int id, [FromBody] PaymentRequestDto request)
    {
        var eventItem = await uow.EventRepository.GetByIdAsync(id);
        if (eventItem == null)
            return NotFound($"Event with ID {id} not found.");

        var paymentMethod = await uow.PaymentMethodRepository.GetByIdAsync(request.PaymentMethodId);
        if (paymentMethod == null)
            return BadRequest("Payment method not found.");

        var patientStripeCustomerId = paymentMethod.User.StripeCustomerId;
        if (string.IsNullOrEmpty(patientStripeCustomerId))
            return BadRequest("Patient does not have a Stripe customer account.");

        var doctorStripeAccountId = eventItem.DoctorEvent.Doctor.StripeConnectAccountId;
        if (string.IsNullOrEmpty(doctorStripeAccountId))
            return BadRequest("Doctor does not have a Stripe Connect account.");

        var serviceEntity = await uow.ServiceRepository.GetByIdAsync(eventItem.EventService.ServiceId);
        if (serviceEntity == null)
            return BadRequest("Service not found for event.");

        var amountInCents = serviceEntity.Price * 100;

        if (paymentMethod.StripePaymentMethodId == null)
            return BadRequest("The selected PaymentMethod does not have a Stripe PaymentMethodId.");

        var paymentIntent = await stripeService.CreatePaymentIntentAsync(
            patientStripeCustomerId,
            paymentMethod.StripePaymentMethodId,
            doctorStripeAccountId,
            amountInCents,
            CommissionInCents
        );

        if (paymentIntent == null)
            return BadRequest("Error processing payment.");

        var status = Utils.MapStripeStatusToPaymentStatus(paymentIntent.Status);

        var payment = new Payment
        {
            Amount = serviceEntity.Price,
            Currency = "MXN",
            Date = DateTime.UtcNow,
            PaymentStatus = status,
            StripePaymentIntent = paymentIntent.Id,
            EventId = eventItem.Id,
            PaymentMethodId = paymentMethod.Id
        };

        eventItem.Payments.Add(payment);
        uow.PaymentRepository.Add(payment);

        if (!await uow.Complete())
            return BadRequest("Error saving payment details.");

        return Ok(new { PaymentIntentId = paymentIntent.Id, Status = paymentIntent.Status });
    }

    [HttpPost]
    public async Task<ActionResult<EventDto?>> CreateAsync([FromBody] EventCreateDto request)
    {
        if (request.DateFrom == default || request.DateTo == default)
            return BadRequest("Las fechas de inicio y fin son requeridas.");

        var currentUser = await uow.UserRepository.GetByIdAsync(User.GetUserId());
        if (currentUser == null)
            return BadRequest($"Usuario de ID {User.GetUserId()} no fue encontrado.");

        var patient = await uow.UserRepository.GetByIdAsync(request.PatientId);
        if (patient == null)
            return BadRequest($"Paciente de ID {request.PatientId} no fue encontrado.");

        var serviceEntity = await uow.ServiceRepository.GetByIdAsync(request.ServiceId);
        if (serviceEntity == null)
            return BadRequest($"Tratamiento de ID {request.ServiceId} no fue encontrado.");

        var clinicEntity = await uow.AddressRepository.GetByIdAsync(request.ClinicId);
        if (clinicEntity == null)
            return BadRequest($"Clínica de ID {request.ClinicId} no fue encontrada.");

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
                if (nurseEntity == null)
                    return BadRequest($"Enfermera de ID {nurseId} no fue encontrada.");

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

        if (!await uow.Complete())
            return BadRequest("Error al crear el evento.");

        var marketingSuccess = await ProcessEventMarketingAsync(
            newEvent,
            doctor,
            patient,
            serviceEntity,
            request.DateFrom,
            request.DateTo
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
        if (item == null) return NotFound($"{SubjectArticle} {Subject} de ID {id} no fue encontrado.");

        if (request.Evolution != null)
        {
            item.Evolution = request.Evolution;
        }

        if (request.NextSteps != null)
        {
            item.NextSteps = request.NextSteps;
        }

        if (uow.HasChanges())
        {
            if (!await uow.Complete()) return BadRequest($"Error al actualizar {Subject}.");
        }

        var itemDto = await uow.EventRepository.GetDtoByIdAsync(item.Id);
        return itemDto;
    }

    [HttpPut("{id:int}/evolution")]
    public async Task<ActionResult<EventDto?>> UpdateEvolutionAsync([FromRoute] int id,
        [FromBody] EventUpdateEvolutionDto request)
    {
        if (string.IsNullOrEmpty(request.Content)) return BadRequest("La evolución es requerida.");

        var item = await uow.EventRepository.GetByIdAsync(id);
        if (item == null) return NotFound($"{SubjectArticle} {Subject} de ID {id} no fue encontrado.");

        item.Evolution = request.Content;

        if (uow.HasChanges())
        {
            if (!await uow.Complete()) return BadRequest($"Error al actualizar {Subject}.");
        }

        var itemDto = await uow.EventRepository.GetDtoByIdAsync(item.Id);
        return itemDto;
    }

    [HttpPut("{id:int}/next-steps")]
    public async Task<ActionResult<EventDto?>> UpdateNextStepAsync([FromRoute] int id,
        [FromBody] EventUpdateNextStepDto request)
    {
        if (string.IsNullOrEmpty(request.Content)) return BadRequest("El siguiente paso es requerido.");

        var item = await uow.EventRepository.GetByIdAsync(id);
        if (item == null) return NotFound($"{SubjectArticle} {Subject} de ID {id} no fue encontrado.");

        item.NextSteps = request.Content;

        if (uow.HasChanges())
        {
            if (!await uow.Complete()) return BadRequest($"Error al actualizar {Subject}.");
        }

        var itemDto = await uow.EventRepository.GetDtoByIdAsync(item.Id);
        return itemDto;
    }

    private async Task<bool> ProcessEventMarketingAsync(Event eventItem, AppUser doctor, AppUser patient,
        dynamic serviceEntity, DateTime dateFrom, DateTime dateTo)
    {
        var formattedDate = dateFrom.ToString("dd/MM/yyyy", CultureInfo.InvariantCulture);
        var doctorName = $"{doctor.FirstName} {doctor.LastName}";
        var appointmentTime = $"{dateFrom.TimeOfDay} - {dateTo.TimeOfDay}";
        const string emailSubject = "DocHub | Confirmación de cita";

        if (string.IsNullOrEmpty(serviceEntity.Name))
        {
            return false;
        }

        var htmlMessage = emailService.CreateAppointmentConfirmationEmail(
            doctorName,
            formattedDate,
            appointmentTime,
            serviceEntity.Name
        );

        var patientEmail = patient.Email;
        if (!string.IsNullOrEmpty(patientEmail))
        {
            await emailService.SendMail(patientEmail, emailSubject, htmlMessage);
        }
        else
        {
            Log.Warning("Patient email is missing for event ID {EventId}", eventItem.Id);
        }

        var patientEventNotification = await notificationsService.CreateForPatientEventConfirmation(eventItem, patient);
        await NotifyUserAsync(User.GetUserId(), mapper.Map<NotificationDto>(patientEventNotification));
        patient.UserNotifications.Add(patientEventNotification);

        var doctorEventNotification = await notificationsService.CreateForDoctorEventConfirmation(eventItem, doctor);
        await NotifyUserAsync(doctor.Id, mapper.Map<NotificationDto>(doctorEventNotification));
        doctor.UserNotifications.Add(doctorEventNotification);

        return true;
    }

    private async Task NotifyUserAsync(int userId, NotificationDto notification)
    {
        Log.Information("Sending notification to user ID {UserId}", userId);
        await hubContext.Clients.User(userId.ToString()).SendAsync("ReceiveNotification", notification);
    }
}
#nullable enable

using System.Globalization;
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
using Stripe;
using MainService.Models.Entities.Aggregate;
using Microsoft.EntityFrameworkCore;
using AutoMapper;

namespace MainService.Controllers;

[Authorize]
public class EventsController(
    IUnitOfWork uow, 
    IEventsService service, 
    UserManager<AppUser> userManager, 
    IEmailService emailService, 
    IStripeService stripeService,
    // IMapper mapper,
    IUsersService usersService
)
    : BaseApiController
{
    private static readonly string subject = "cita";
    private static readonly string subjectArticle = "La";


    public async Task<ActionResult<PagedList<EventDto>>> GetPagedListAsync([FromQuery] EventParams param)
    {
        if (param.IsCalendarView)
        {
            var list = await uow.EventRepository.GetAllDtoAsync(param, User);
            return Ok(list);
        }

        var pagedList = await uow.EventRepository.GetPagedListAsync(param, User);
        
        if (pagedList == null) return NotFound($"{subjectArticle} {subject} no fue encontrada.");
    
        Response.AddPaginationHeader(new PaginationHeader(pagedList.CurrentPage, pagedList.PageSize,
            pagedList.TotalCount, pagedList.TotalPages));
    
        return pagedList;
    }
    
    // [AllowAnonymous]
    // [HttpGet("all")]
    // public async Task<ActionResult<List<EventDto>>> GetAllAsync([FromQuery] EventParams param)
    // {
    //
    //     return data;
    // }

    [HttpGet("doctor-fields")]
    public async Task<ActionResult<EventDoctorFieldsDto>> GetDoctorFieldsAsync()
    {
        var item = await uow.EventRepository.GetDoctorFieldsDtoAsync(User);

        if (item == null) return NotFound($"{subjectArticle} {subject} no fue encontrado.");

        return item;
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<EventDto>> GetByIdAsync([FromRoute] int id)
    {
        var item = await uow.EventRepository.GetDtoByIdAsync(id);

        if (item == null) return NotFound($"{subjectArticle} {subject} de ID {id} no fue encontrado.");

        return item;
    }
    
        
    [HttpGet("summary")]
    public async Task<ActionResult<List<EventSummaryDto>>> GetSummaryAsync([FromQuery] EventParams param)
    {
        var item = await uow.EventRepository.GetSummaryDtosAsync(param, User);

        if (item == null) return NotFound($"{subjectArticle} {subject} no fue encontrado.");

        return item;
    }

    // // [Authorize(Policy = "RequireAdminRole")]
    // [HttpDelete("{id}")]
    // public async Task<ActionResult> DeleteByIdAsync(int id)
    // {
    //     var item = await uow.EventRepository.GetByIdAsNoTrackingAsync(id);
    //
    //     if (item == null) return NotFound($"{subjectArticle} {subject} de ID {id} no fue encontrado.");
    //
    //     var deleteResult = await service.DeleteAsync(item);
    //
    //     if (!deleteResult) return BadRequest($"Error al eliminar {subject} de {item.Name}.");
    //
    //     return Ok();
    // }

    [HttpDelete("range/{ids}")]
    public async Task<ActionResult> DeleteRangeAsync([FromRoute] string ids)
    {
        var selectedIds = ids.Split(',').Select(int.Parse).ToList();

        foreach (var item in selectedIds)
        {
            var itemToDelete = await uow.EventRepository.GetByIdAsNoTrackingAsync(item);

            if (itemToDelete == null) return NotFound($"{subjectArticle} {subject} de ID {item} no fue encontrado.");

            var deleteResult = await service.DeleteAsync(itemToDelete);
        }

        return Ok();
    }

    [HttpPost("search")]
    public async Task<ActionResult<EventDto>> PatientCreateAsync([FromBody] PatientCreateEventDto request)
    {
        int userId = User.GetUserId();

        Models.Entities.Event eventToCreate = new();

        if (!await uow.UserRepository.ExistsByIdAsync(userId))
        return BadRequest($"Usuario de ID {userId} no fue encontrado.");

        if (request.Doctor == null)
        return BadRequest("Doctor es requerido.");

        if (!await uow.UserRepository.ExistsByIdAsync(request.Doctor.Id))
        return BadRequest($"Doctor de ID {request.Doctor.Id} no fue encontrado.");

        if (!await uow.UserRepository.HasDoctorRoleByIdAsync(request.Doctor.Id))
        return BadRequest($"El usuario con ID {request.Doctor.Id} no tiene el rol de doctor.");

        if (request.Service == null)
        return BadRequest("El servicio es requerido.");

        if (!await uow.ServiceRepository.ExistsByIdAsync(request.Service.Id))
        return BadRequest($"El servicio con ID {request.Service.Id} no fue encontrado.");

        if (!await uow.ServiceRepository.ExistsByIdAndDoctorIdAsync(request.Service.Id, request.Doctor.Id))
        return BadRequest($"Servicio de ID {request.Service.Id} no fue encontrado.");

        if (request.Clinic == null)
        return BadRequest("La clinica es requerida.");

        if (!await uow.AddressRepository.ExistsByIdAsync(request.Clinic.Id))
        return BadRequest($"La clinica de ID {request.Clinic.Id} no fue encontrada.");

        if (!await uow.AddressRepository.ExistsByIdAndDoctorIdAsync(request.Clinic.Id, request.Doctor.Id))
        return BadRequest($"La clinica de ID {request.Clinic.Id} no fue encontrada.");

        if (request.PaymentMethodType == null)
        return BadRequest("El método de pago es requerido.");

        if (!await uow.PaymentMethodTypeRepository.ExistsByIdAsync(request.PaymentMethodType.Id))
        return BadRequest($"Método de pago de ID {request.PaymentMethodType.Id} no fue encontrado.");

        if (!await uow.PaymentMethodTypeRepository.ExistsByIdAndDoctorIdAsync(request.PaymentMethodType.Id, request.Doctor.Id))
        return BadRequest($"Método de pago de ID {request.PaymentMethodType.Id} no fue encontrado para el doctor actual.");

        if (request.MedicalInsuranceCompany != null)
        {
            if (!await uow.MedicalInsuranceCompanyRepository.ExistsByIdAsync(request.MedicalInsuranceCompany.Id))
            return BadRequest($"Compañía de seguro médico de ID {request.MedicalInsuranceCompany.Id} no fue encontrada.");            

            if (!await uow.MedicalInsuranceCompanyRepository.ExistsByIdAndDoctorIdAsync(request.MedicalInsuranceCompany.Id, request.Doctor.Id))
            return BadRequest($"Compañía de seguro médico de ID {request.MedicalInsuranceCompany.Id} no fue encontrada para el doctor actual.");

            eventToCreate.EventMedicalInsuranceCompany = new(request.MedicalInsuranceCompany.Id);
        }

        if (!request.DateFrom.HasValue)
        return BadRequest("La fecha de inicio es requerida.");

        if (!request.DateTo.HasValue)
        return BadRequest("La fecha de fin es requerida.");
        
        if (string.IsNullOrEmpty(request.TimeFrom))
        return BadRequest("La hora de inicio es requerida.");
        
        if (string.IsNullOrEmpty(request.TimeTo))
        return BadRequest("La hora de fin es requerida.");

        if (!await service.IsDoctorAvailableAsync(request.Doctor.Id, request.DateFrom.Value, request.DateTo.Value))
        return BadRequest("El doctor no está disponible en el horario seleccionado.");

        AppUser doctorAsNoTracking = await userManager.Users
            .AsNoTracking()
            .SingleAsync(x => x.Id == request.Doctor.Id);

        AppUser patientAsNoTracking = await userManager.Users
            .AsNoTracking()
            .SingleAsync(x => x.Id == userId);

        OptionDto clinicOption = request.Clinic;
        OptionDto doctorOption = request.Doctor;
        OptionDto serviceOption = request.Service;
        OptionDto paymentMethodTypeOption = request.PaymentMethodType;
        OptionDto? medicalInsuranceCompanyOption = request.MedicalInsuranceCompany;

        Models.Entities.Service serviceAsNoTracking = await uow.ServiceRepository.GetByIdAsNoTrackingAsync(request.Service.Id);

        if ((request.PaymentMethodType.Id == 1 || request.PaymentMethodType.Id == 2) && doctorAsNoTracking.RequireAnticipatedCardPayments)
        {
            if (string.IsNullOrEmpty(request.StripePaymentMethodId))
                return BadRequest("StripePaymentMethodId es requerido para el pago anticipado.");

            if (string.IsNullOrEmpty(doctorAsNoTracking.StripeConnectAccountId))
            {
                Account account = await stripeService.CreateExpressAccountAsync(doctorAsNoTracking);
                if (!await usersService.UpdateStripeConnectAccountId(doctorAsNoTracking.Id, account.Id))
                    return BadRequest("Error al actualizar la cuenta de Stripe del doctor.");
            }

            PaymentIntent payment = await stripeService.CreatePaymentIntentAsync(
                patientAsNoTracking.StripeCustomerId, 
                request.StripePaymentMethodId, 
                doctorAsNoTracking.StripeConnectAccountId, 
                serviceAsNoTracking.Price * 100, 5 * 100
            );

            if (payment == null) return BadRequest("Error al procesar el pago.");
            if (payment.Status != "succeeded") return BadRequest("Error al procesar el pago. Intente con otro método de pago.");
        }

        if (!await usersService.AddPatientToDoctorAsync(doctorAsNoTracking.Id, patientAsNoTracking.Id))
            return BadRequest("Error al agregar el paciente al doctor.");

        eventToCreate.DateFrom = request.DateFrom.Value;
        eventToCreate.DateTo = request.DateTo.Value;
        eventToCreate.DateFrom = eventToCreate.DateFrom.Add(TimeSpan.Parse(request.TimeFrom));
        eventToCreate.DateTo = eventToCreate.DateTo.Add(TimeSpan.Parse(request.TimeTo));
        eventToCreate.PatientEvent = new(userId);
        eventToCreate.DoctorEvent = new(request.Doctor.Id);
        eventToCreate.EventService = new(request.Service.Id);
        eventToCreate.EventClinic = new(request.Clinic.Id);
        
        uow.EventRepository.Add(eventToCreate);

        if (!await uow.Complete()) return BadRequest($"Error al crear {subject}.");

        var itemDto = await uow.EventRepository.GetDtoByIdAsync(eventToCreate.Id);

        return itemDto;
    }

    [HttpPost]
    public async Task<ActionResult<EventDto>> CreateAsync([FromBody] EventCreateDto request)
    {
        // TODO: que cuando el rol del usuario de la peticion, cuando este es nurse, obtener el ID del doctor para 
        // la propiedad de Event de DoctorEvent

        var user = await uow.UserRepository.GetByIdAsync(User.GetUserId());

        var userRoles = await userManager.GetRolesAsync(user);

        IEnumerable<int> nurseIds = [];
        int doctorId = 0;
        AppUser? doctor = null;

        AppUser patient = await uow.UserRepository.GetByIdAsync(request.PatientId);
        if (patient == null) return BadRequest($"Paciente de ID {request.PatientId} no fue encontrado.");
        Models.Entities.Service doctorService = await uow.ServiceRepository.GetByIdAsync(request.ServiceId);
        if (doctorService == null) return BadRequest($"Tratamiento de ID {request.ServiceId} no fue encontrado.");

        if (userRoles.Contains("Doctor") && request.Role == "Doctor")
        {
            doctorId = user.Id;
            doctor = user;

            if (!await uow.UserRepository.PatientExistsAsync(request.PatientId, doctorId))
                return BadRequest($"Paciente de ID {request.PatientId} no fue encontrado o no existe para el doctor actual.");

            nurseIds = request.NursesIds.Split(',')
                .Select(s => int.TryParse(s, out var n) ? n : (int?)null)
                .Where(n => n.HasValue)
                .Select(n => n!.Value);
        }
        else
        {
            doctorId = request.DoctorId;
            doctor = await uow.UserRepository.GetByIdAsync(request.DoctorId);
            if (doctor == null) return BadRequest($"Doctor de ID {request.DoctorId} no fue encontrado.");

            var isAvailable = await service.IsDoctorAvailableAsync(request.DoctorId, request.DateFrom, request.DateTo);
            if (!isAvailable) return BadRequest("El doctor no está disponible en el horario seleccionado.");

            if ((request.PaymentMethodTypeId == 1 || request.PaymentMethodTypeId == 2) && doctor.RequireAnticipatedCardPayments)
            {
                if (string.IsNullOrEmpty(request.StripePaymentMethodId))
                    return BadRequest("StripePaymentMethodId es requerido para el pago anticipado.");

                if (string.IsNullOrEmpty(doctor.StripeConnectAccountId))
                {
                    Account account = await stripeService.CreateExpressAccountAsync(doctor);
                    doctor.StripeConnectAccountId = account.Id;
                }

                PaymentIntent payment = await stripeService.CreatePaymentIntentAsync(patient.StripeCustomerId, request.StripePaymentMethodId, doctor.StripeConnectAccountId, doctorService.Price * 100, 5 * 100);

                if (payment == null) return BadRequest("Error al procesar el pago.");
                if (payment.Status != "succeeded") return BadRequest("Error al procesar el pago. Intente con otro método de pago.");
            }

            bool patientExists = await uow.UserRepository.PatientExistsAsync(user.Id, doctorId);
            Console.WriteLine($"PatientExists: {patientExists}");
            if (!patientExists)
            {
                doctor.Patients.Add(new DoctorPatient(request.DoctorId, user.Id) { HasPatientInformationAccess = request.HasPatientInformationAccess });
            }
            else
            {
                var doctorPatient = doctor.Patients.FirstOrDefault(p => p.PatientId == user.Id);
                if (doctorPatient != null)
                {
                    doctorPatient.HasPatientInformationAccess = request.HasPatientInformationAccess;
                }
            }
        }

        if (!await uow.UserRepository.DoctorExistsAsync(doctorId, doctorId))
            return BadRequest($"Doctor de ID {doctorId} no fue encontrado o no existe para el doctor actual.");

        if (!await uow.AddressRepository.ExistsByIdAndDoctorIdAsync(request.ClinicId, doctorId))
            return BadRequest($"Clinica de ID {request.PatientId} no fue encontrado o no existe para el doctor actual.");

        if (!await uow.ServiceRepository.ExistsByIdAndDoctorIdAsync(request.ServiceId, doctorId))
            return BadRequest($"Tratamiento de ID {request.ServiceId} no fue encontrado o no existe para el doctor actual.");

        foreach (var nurseId in nurseIds)
        {
            if (!await uow.UserRepository.NurseExistsAsync(nurseId, doctorId))
                return BadRequest($"Especialista de ID {nurseId} no fue encontrado o no existe para el doctor actual.");
        }

        Models.Entities.Event item = new(request.AllDay, request.DateFrom, request.DateTo, request.TimeFrom, request.TimeTo)
        {
            NurseEvents = nurseIds.Select(x => new NurseEvent(x)).ToList(),
            EventService = new(request.ServiceId),
            PatientEvent = new(request.PatientId),
            EventClinic = new(request.ClinicId),
            DoctorEvent = new(doctorId),
            EventPaymentMethodType = request.PaymentMethodTypeId > 0 ? new(request.PaymentMethodTypeId) : null,
            EventMedicalInsuranceCompany = request.MedicalInsuranceCompanyId > 0 ? new(request.MedicalInsuranceCompanyId) : null
        };

        uow.EventRepository.Add(item);

        if (!await uow.Complete()) return BadRequest($"Error al crear {subject}.");

        string formattedDate = request.DateFrom.ToString("dd/MM/yyyy", CultureInfo.InvariantCulture);
        string emailSubject = $"Mediverse: Confirmación de tu cita!";
        string htmlMessage =  emailService.CreateAppointmentConfirmationEmail(doctor.FirstName + " " + doctor.LastName, formattedDate, request.TimeFrom + " - " + request.TimeTo, doctorService.Name);

        await emailService.SendMail(patient.Email, emailSubject, htmlMessage);

        var itemDto = await uow.EventRepository.GetDtoByIdAsync(item.Id);

        return itemDto;
    }

    [HttpPut("{id}")]
    public async Task<ActionResult<EventDto>> UpdateAsync([FromRoute] int id, [FromBody] EventUpdateDto request)
    {
        var item = await uow.EventRepository.GetByIdAsync(id);
        if (item == null) return NotFound($"{subjectArticle} {subject} de ID {id} no fue encontrado.");

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
            if (!await uow.Complete()) return BadRequest($"Error al actualizar {subject}.");
        }

        var itemDto = await uow.EventRepository.GetDtoByIdAsync(item.Id);

        return itemDto;
    }
}

#nullable disable
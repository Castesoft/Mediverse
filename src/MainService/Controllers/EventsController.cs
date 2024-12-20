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


    [HttpGet]
    public async Task<ActionResult<PagedList<EventDto>>> GetPagedListAsync([FromQuery] EventParams param)
    {
        param.DoctorId = User.GetUserId();

        if (param.IsCalendarView.HasValue && param.IsCalendarView.Value == true)
        {
            var list = await uow.EventRepository.GetAllDtoAsync(param);
            return Ok(list);
        }

        var pagedList = await uow.EventRepository.GetPagedListAsync(param);
        
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
    public async Task<ActionResult<EventDto?>> GetByIdAsync([FromRoute] int id)
    {
        var item = await uow.EventRepository.GetDtoByIdAsync(id);

        if (item == null) return NotFound($"{subjectArticle} {subject} de ID {id} no fue encontrado.");

        return item;
    }
    
        
    [HttpGet("summary")]
    public async Task<ActionResult<List<EventSummaryDto>>> GetSummaryAsync([FromQuery] EventParams param)
    {
        param.DoctorId = User.GetUserId();
        
        var item = await uow.EventRepository.GetSummaryDtosAsync(param);

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
    public async Task<ActionResult<EventDto?>> PatientCreateAsync([FromBody] PatientCreateEventDto request)
    {
        int userId = User.GetUserId();

        Models.Entities.Event eventToCreate = new();

        if (!await uow.UserRepository.ExistsByIdAsync(userId))
        return BadRequest($"Usuario de ID {userId} no fue encontrado.");

        if (request.Doctor == null) return BadRequest("Doctor es requerido.");
        if (!request.Doctor.Id.HasValue) return BadRequest("El doctor es requerido.");

        if (!await uow.UserRepository.ExistsByIdAsync(request.Doctor.Id.Value))
        return BadRequest($"Doctor de ID {request.Doctor.Id} no fue encontrado.");

        if (!await uow.UserRepository.HasDoctorRoleByIdAsync(request.Doctor.Id.Value))
        return BadRequest($"El usuario con ID {request.Doctor.Id} no tiene el rol de doctor.");

        if (request.Service == null) return BadRequest("El servicio es requerido.");
        if (!request.Service.Id.HasValue) return BadRequest("El servicio es requerido.");

        if (!await uow.ServiceRepository.ExistsByIdAsync(request.Service.Id.Value))
        return BadRequest($"El servicio con ID {request.Service.Id.Value} no fue encontrado.");

        if (!await uow.ServiceRepository.ExistsByIdAndDoctorIdAsync(request.Service.Id.Value, request.Doctor.Id.Value))
        return BadRequest($"Servicio de ID {request.Service.Id.Value} no fue encontrado.");

        if (request.Clinic == null) return BadRequest("La clinica es requerida.");
        if (!request.Clinic.Id.HasValue) return BadRequest("La clinica es requerida.");

        if (!await uow.AddressRepository.ExistsByIdAsync(request.Clinic.Id.Value))
        return BadRequest($"La clinica de ID {request.Clinic.Id.Value} no fue encontrada.");

        if (!await uow.AddressRepository.ExistsByIdAndDoctorIdAsync(request.Clinic.Id.Value, request.Doctor.Id.Value))
        return BadRequest($"La clinica de ID {request.Clinic.Id.Value} no fue encontrada.");

        if (request.PaymentMethodType == null) return BadRequest("El método de pago es requerido.");
        if (!request.PaymentMethodType.Id.HasValue) return BadRequest("El método de pago es requerido.");

        if (!await uow.PaymentMethodTypeRepository.ExistsByIdAsync(request.PaymentMethodType.Id.Value))
        return BadRequest($"Método de pago de ID {request.PaymentMethodType.Id.Value} no fue encontrado.");

        if (!await uow.PaymentMethodTypeRepository.ExistsByIdAndDoctorIdAsync(request.PaymentMethodType.Id.Value, request.Doctor.Id.Value))
        return BadRequest($"Método de pago de ID {request.PaymentMethodType.Id.Value} no fue encontrado para el doctor actual.");

        if (request.MedicalInsuranceCompany != null)
        {
            if (!request.MedicalInsuranceCompany.Id.HasValue) return BadRequest("Compañía de seguro médico es requerida.");
            
            if (!await uow.MedicalInsuranceCompanyRepository.ExistsByIdAsync(request.MedicalInsuranceCompany.Id.Value))
            return BadRequest($"Compañía de seguro médico de ID {request.MedicalInsuranceCompany.Id.Value} no fue encontrada.");            

            if (!await uow.MedicalInsuranceCompanyRepository.ExistsByIdAndDoctorIdAsync(request.MedicalInsuranceCompany.Id.Value, request.Doctor.Id.Value))
            return BadRequest($"Compañía de seguro médico de ID {request.MedicalInsuranceCompany.Id.Value} no fue encontrada para el doctor actual.");

            eventToCreate.EventMedicalInsuranceCompany = new(request.MedicalInsuranceCompany.Id.Value);
        }

        if (!request.DateFrom.HasValue)
        return BadRequest("La fecha de inicio es requerida.");

        if (!request.DateTo.HasValue)
        return BadRequest("La fecha de fin es requerida.");
        
        if (string.IsNullOrEmpty(request.TimeFrom))
        return BadRequest("La hora de inicio es requerida.");
        
        if (string.IsNullOrEmpty(request.TimeTo))
        return BadRequest("La hora de fin es requerida.");

        if (!await service.IsDoctorAvailableAsync(request.Doctor.Id.Value, request.DateFrom.Value, request.DateTo.Value))
        return BadRequest("El doctor no está disponible en el horario seleccionado.");

        AppUser doctorAsNoTracking = await userManager.Users
            .AsNoTracking()
            .SingleAsync(x => x.Id == request.Doctor.Id.Value);

        AppUser patientAsNoTracking = await userManager.Users
            .AsNoTracking()
            .SingleAsync(x => x.Id == userId);

        OptionDto clinicOption = request.Clinic;
        OptionDto doctorOption = request.Doctor;
        OptionDto serviceOption = request.Service;
        OptionDto paymentMethodTypeOption = request.PaymentMethodType;
        OptionDto? medicalInsuranceCompanyOption = request.MedicalInsuranceCompany;

        Models.Entities.Service? serviceAsNoTracking = await uow.ServiceRepository.GetByIdAsNoTrackingAsync(request.Service.Id.Value);

        if (serviceAsNoTracking == null) return BadRequest($"Tratamiento de ID {request.Service.Id.Value} no fue encontrado.");

        if ((request.PaymentMethodType.Id.Value == 1 || request.PaymentMethodType.Id.Value == 2) && doctorAsNoTracking.RequireAnticipatedCardPayments.HasValue && doctorAsNoTracking.RequireAnticipatedCardPayments.Value)
        {
            if (string.IsNullOrEmpty(request.StripePaymentMethodId))
                return BadRequest("StripePaymentMethodId es requerido para el pago anticipado.");

            if (string.IsNullOrEmpty(doctorAsNoTracking.StripeConnectAccountId))
            {
                Account account = await stripeService.CreateExpressAccountAsync(doctorAsNoTracking);
                if (!await usersService.UpdateStripeConnectAccountId(doctorAsNoTracking.Id, account.Id))
                    return BadRequest("Error al actualizar la cuenta de Stripe del doctor.");
            }

            if (
                !string.IsNullOrEmpty(patientAsNoTracking.StripeCustomerId) &&
                !string.IsNullOrEmpty(doctorAsNoTracking.StripeConnectAccountId) &&
                !string.IsNullOrEmpty(request.StripePaymentMethodId) &&
                serviceAsNoTracking.Price.HasValue
            ) {
                PaymentIntent payment = await stripeService.CreatePaymentIntentAsync(
                    patientAsNoTracking.StripeCustomerId, 
                    request.StripePaymentMethodId, 
                    doctorAsNoTracking.StripeConnectAccountId, 
                    serviceAsNoTracking.Price.Value * 100, 5 * 100
                );

                if (payment == null) return BadRequest("Error al procesar el pago.");
                if (payment.Status != "succeeded") return BadRequest("Error al procesar el pago. Intente con otro método de pago.");
            } else {
                return BadRequest("Error al procesar el pago. Intente con otro método de pago.");
            }
        }

        if (!await usersService.AddPatientToDoctorAsync(doctorAsNoTracking.Id, patientAsNoTracking.Id)) 
        return BadRequest("Error al agregar el paciente al doctor.");

        eventToCreate.DateFrom = request.DateFrom.Value;
        eventToCreate.DateTo = request.DateTo.Value;
        eventToCreate.DateFrom = eventToCreate.DateFrom.Value.Add(TimeSpan.Parse(request.TimeFrom));
        eventToCreate.DateTo = eventToCreate.DateTo.Value.Add(TimeSpan.Parse(request.TimeTo));
        eventToCreate.PatientEvent = new(userId);
        eventToCreate.DoctorEvent = new(request.Doctor.Id.Value);
        eventToCreate.EventService = new(request.Service.Id.Value);
        eventToCreate.EventClinic = new(request.Clinic.Id.Value);
        
        uow.EventRepository.Add(eventToCreate);

        if (!await uow.Complete()) return BadRequest($"Error al crear {subject}.");

        var itemDto = await uow.EventRepository.GetDtoByIdAsync(eventToCreate.Id);

        return itemDto;
    }

    [HttpPost]
    public async Task<ActionResult<EventDto?>> CreateAsync([FromBody] EventCreateDto request)
    {
        // TODO: que cuando el rol del usuario de la peticion, cuando este es nurse, obtener el ID del doctor para 
        // la propiedad de Event de DoctorEvent

        if (!request.AllDay.HasValue) return BadRequest("La duración es requerida.");
        if (request.Patient == null) return BadRequest("El paciente es requerido.");
        if (!request.Patient.Id.HasValue) return BadRequest("El paciente es requerido.");
        if (!request.DateFrom.HasValue) return BadRequest("La fecha de inicio es requerida.");
        if (!request.DateTo.HasValue) return BadRequest("La fecha de fin es requerida.");
        if (request.Service == null) return BadRequest("El servicio es requerido.");
        if (!request.Service.Id.HasValue) return BadRequest("El servicio es requerido.");
        if (request.Clinic == null) return BadRequest("La clínica es requerida.");
        if (!request.Clinic.Id.HasValue) return BadRequest("La clínica es requerida.");

        AppUser? user = await uow.UserRepository.GetByIdAsync(User.GetUserId());

        if (user == null) return BadRequest($"Usuario de ID {User.GetUserId()} no fue encontrado.");

        IList<string> userRoles = await userManager.GetRolesAsync(user);

        int doctorId = User.GetUserId();
        AppUser? doctor = null;

        AppUser? patient = await uow.UserRepository.GetByIdAsync(request.Patient.Id.Value);

        if (patient == null) return BadRequest($"Paciente de ID {request.Patient.Id.Value} no fue encontrado.");

        Models.Entities.Service? doctorService = await uow.ServiceRepository.GetByIdAsync(request.Service.Id.Value);

        if (doctorService == null) return BadRequest($"Tratamiento de ID {request.Service.Id.Value} no fue encontrado.");

        if (userRoles.Contains("Doctor"))
        {
            doctorId = user.Id;
            doctor = user;

            if (!await uow.PatientRepository.ExistsAsync(request.Patient.Id.Value, doctorId))
                return BadRequest($"Paciente de ID {request.Patient.Id.Value} no fue encontrado o no existe para el doctor actual.");
        }
        else
        {
            doctor = await uow.UserRepository.GetByIdAsync(doctorId);
            if (doctor == null) return BadRequest($"Doctor de ID {doctorId} no fue encontrado.");

            var isAvailable = await service.IsDoctorAvailableAsync(doctorId, request.DateFrom.Value, request.DateTo.Value);
            if (!isAvailable) return BadRequest("El doctor no está disponible en el horario seleccionado.");

            if (!request.PaymentMethodTypeId.HasValue) return BadRequest("El método de pago es requerido.");

            if ((request.PaymentMethodTypeId.Value == 1 || request.PaymentMethodTypeId.Value == 2) && doctor.RequireAnticipatedCardPayments.HasValue && doctor.RequireAnticipatedCardPayments.Value)
            {
                if (string.IsNullOrEmpty(request.StripePaymentMethodId))
                    return BadRequest("StripePaymentMethodId es requerido para el pago anticipado.");

                if (string.IsNullOrEmpty(doctor.StripeConnectAccountId))
                {
                    Account account = await stripeService.CreateExpressAccountAsync(doctor);
                    doctor.StripeConnectAccountId = account.Id;
                }

                if (!string.IsNullOrEmpty(patient.StripeCustomerId) && doctorService.Price.HasValue) {
                    PaymentIntent payment = await stripeService.CreatePaymentIntentAsync(patient.StripeCustomerId, request.StripePaymentMethodId, doctor.StripeConnectAccountId, doctorService.Price.Value * 100, 5 * 100);

                    if (payment == null) return BadRequest("Error al procesar el pago.");
                    if (payment.Status != "succeeded") return BadRequest("Error al procesar el pago. Intente con otro método de pago.");
                }
            }

            bool patientExists = await uow.PatientRepository.ExistsAsync(user.Id, doctorId);
            Console.WriteLine($"PatientExists: {patientExists}");
            if (!request.HasPatientInformationAccess.HasValue) return BadRequest("Es requerido el acceso a la información del paciente.");
            if (!patientExists)
            {
                
                doctor.Patients.Add(new DoctorPatient(doctorId, user.Id) { HasPatientInformationAccess = request.HasPatientInformationAccess.Value });
            }
            else
            {
                var doctorPatient = doctor.Patients.FirstOrDefault(p => p.PatientId == user.Id);
                if (doctorPatient != null)
                {
                    doctorPatient.HasPatientInformationAccess = request.HasPatientInformationAccess.Value;
                }
            }
        }

        if (!await uow.UserRepository.DoctorExistsAsync(doctorId, doctorId))
            return BadRequest($"Doctor de ID {doctorId} no fue encontrado o no existe para el doctor actual.");

        if (!await uow.AddressRepository.ExistsByIdAndDoctorIdAsync(request.Clinic.Id.Value, doctorId))
            return BadRequest($"Clinica de ID {request.Patient.Id.Value} no fue encontrado o no existe para el doctor actual.");

        if (!await uow.ServiceRepository.ExistsByIdAndDoctorIdAsync(request.Service.Id.Value, doctorId))
            return BadRequest($"Tratamiento de ID {request.Service} no fue encontrado o no existe para el doctor actual.");

        foreach (var nurseId in request.Nurses)
        {
            if (!nurseId.Id.HasValue) return BadRequest("Enfermera es requerida.");
            
            if (!await uow.UserRepository.NurseExistsAsync(nurseId.Id.Value, doctorId))
                return BadRequest($"Especialista de ID {nurseId} no fue encontrado o no existe para el doctor actual.");
        }

        Models.Entities.Event item = new(request.AllDay.Value, request.DateFrom.Value, request.DateTo.Value)
        {
            NurseEvents = request.Nurses.Select(x => new NurseEvent(x.Id!.Value)).ToList(),
            EventService = new(request.Service.Id.Value),
            PatientEvent = new(request.Patient.Id.Value),
            EventClinic = new(request.Clinic.Id.Value),
            DoctorEvent = new(doctorId),
        };

        if (request.PaymentMethodTypeId.HasValue) {
            item.EventPaymentMethodType = new(request.PaymentMethodTypeId.Value);
        }

        if (request.MedicalInsuranceCompanyId.HasValue) {
            item.EventMedicalInsuranceCompany = new(request.MedicalInsuranceCompanyId.Value);
        }

        uow.EventRepository.Add(item);

        if (!await uow.Complete()) return BadRequest($"Error al crear {subject}.");

        string formattedDate = request.DateFrom.Value.ToString("dd/MM/yyyy", CultureInfo.InvariantCulture);
        string emailSubject = $"Mediverse: Confirmación de tu cita!";

        if (string.IsNullOrEmpty(doctorService.Name)) return BadRequest("El nombre del servicio es requerido.");
        
        string htmlMessage =  emailService.CreateAppointmentConfirmationEmail(doctor.FirstName + " " + doctor.LastName, formattedDate, request.DateFrom.Value.TimeOfDay + " - " + request.DateTo.Value.TimeOfDay, doctorService.Name);

        string? patientEmail = patient.Email;

        if (!string.IsNullOrEmpty(patientEmail)) {
            await emailService.SendMail(patientEmail, emailSubject, htmlMessage);
        }


        return await uow.EventRepository.GetDtoByIdAsync(item.Id);
    }

    [HttpPut("{id}")]
    public async Task<ActionResult<EventDto?>> UpdateAsync([FromRoute] int id, [FromBody] EventUpdateDto request)
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

    [HttpPut("{id}/evolution")]
    public async Task<ActionResult<EventDto?>> UpdateEvolutionAsync([FromRoute] int id, [FromBody] EventUpdateEvolutionDto request)
    {
        if (string.IsNullOrEmpty(request.Content)) return BadRequest("La evolución es requerida.");
        if (!await uow.EventRepository.ExistsByIdAsync(id)) return NotFound($"{subjectArticle} {subject} de ID {id} no fue encontrado.");
        
        Models.Entities.Event? item = await uow.EventRepository.GetByIdAsync(id);
        if (item == null) return NotFound($"{subjectArticle} {subject} de ID {id} no fue encontrado.");

        item.Evolution = request.Content;

        if (uow.HasChanges())
        {
            if (!await uow.Complete()) return BadRequest($"Error al actualizar {subject}.");
        }

        EventDto? itemDto = await uow.EventRepository.GetDtoByIdAsync(item.Id);

        return itemDto;
    }

    [HttpPut("{id}/next-steps")]
    public async Task<ActionResult<EventDto?>> UpdateNextStepAsync([FromRoute] int id, [FromBody] EventUpdateNextStepDto request)
    {
        if (string.IsNullOrEmpty(request.Content)) return BadRequest("El siguiente paso es requerido.");
        if (!await uow.EventRepository.ExistsByIdAsync(id)) return NotFound($"{subjectArticle} {subject} de ID {id} no fue encontrado.");
        
        Models.Entities.Event? item = await uow.EventRepository.GetByIdAsync(id);
        if (item == null) return NotFound($"{subjectArticle} {subject} de ID {id} no fue encontrado.");

        item.NextSteps = request.Content;

        if (uow.HasChanges())
        {
            if (!await uow.Complete()) return BadRequest($"Error al actualizar {subject}.");
        }

        EventDto? itemDto = await uow.EventRepository.GetDtoByIdAsync(item.Id);

        return itemDto;
    }
}


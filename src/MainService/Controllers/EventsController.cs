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

namespace MainService.Controllers;

[Authorize]
public class EventsController(IUnitOfWork uow, IEventsService service, UserManager<AppUser> userManager, IEmailService emailService, IStripeService stripeService//,  IMapper mapper
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

    [HttpPost("landing")]
    public async Task<ActionResult<EventDto>> PatientCreateAsync([FromBody] PatientCreateEventDto request)
    {
        // TODO: que cuando el rol del usuario de la peticion, cuando este es nurse, obtener el ID del doctor para 
        // la propiedad de Event de DoctorEvent

        var user = await uow.UserRepository.GetByIdAsync(User.GetUserId());

        var userRoles = await userManager.GetRolesAsync(user);

        IEnumerable<int> nurseIds = [];
        int doctorId = 0;
        AppUser doctor = null;

        // AppUser patient = await uow.UserRepository.GetByIdAsync(request.PatientId);
        // if (patient == null) return BadRequest($"Paciente de ID {request.PatientId} no fue encontrado.");
        // Service doctorService = await uow.ServiceRepository.GetByIdAsync(request.ServiceId);
        // if (doctorService == null) return BadRequest($"Tratamiento de ID {request.ServiceId} no fue encontrado.");

        // if (userRoles.Contains("Doctor") && request.Role == "Doctor")
        // {
        //     doctorId = user.Id;
        //     doctor = user;

        //     if (!await uow.UserRepository.PatientExistsAsync(request.PatientId, doctorId))
        //         return BadRequest($"Paciente de ID {request.PatientId} no fue encontrado o no existe para el doctor actual.");

        //     nurseIds = request.NursesIds.Split(',')
        //         .Select(s => int.TryParse(s, out var n) ? n : (int?)null)
        //         .Where(n => n.HasValue)
        //         .Select(n => n.Value);
        // }
        // else
        // {
        //     doctorId = request.DoctorId;
        //     doctor = await uow.UserRepository.GetByIdAsync(request.DoctorId);
        //     if (doctor == null) return BadRequest($"Doctor de ID {request.DoctorId} no fue encontrado.");

        //     var isAvailable = await service.IsDoctorAvailableAsync(request.DoctorId, request.DateFrom, request.DateTo);
        //     if (!isAvailable) return BadRequest("El doctor no está disponible en el horario seleccionado.");

        //     if ((request.PaymentMethodTypeId == 1 || request.PaymentMethodTypeId == 2) && doctor.RequireAnticipatedCardPayments)
        //     {
        //         if (string.IsNullOrEmpty(request.StripePaymentMethodId))
        //             return BadRequest("StripePaymentMethodId es requerido para el pago anticipado.");

        //         if (string.IsNullOrEmpty(doctor.StripeConnectAccountId))
        //         {
        //             Account account = await stripeService.CreateExpressAccountAsync(doctor);
        //             doctor.StripeConnectAccountId = account.Id;
        //         }

        //         PaymentIntent payment = await stripeService.CreatePaymentIntentAsync(patient.StripeCustomerId, request.StripePaymentMethodId, doctor.StripeConnectAccountId, doctorService.Price * 100, 5 * 100);

        //         if (payment == null) return BadRequest("Error al procesar el pago.");
        //         if (payment.Status != "succeeded") return BadRequest("Error al procesar el pago. Intente con otro método de pago.");
        //     }

        //     bool patientExists = await uow.UserRepository.PatientExistsAsync(user.Id, doctorId);
        //     Console.WriteLine($"PatientExists: {patientExists}");
        //     if (!patientExists)
        //     {
        //         doctor.Patients.Add(new DoctorPatient(request.DoctorId, user.Id) { HasPatientInformationAccess = request.HasPatientInformationAccess });
        //     }
        //     else
        //     {
        //         var doctorPatient = doctor.Patients.FirstOrDefault(p => p.PatientId == user.Id);
        //         if (doctorPatient != null)
        //         {
        //             doctorPatient.HasPatientInformationAccess = request.HasPatientInformationAccess;
        //         }
        //     }
        // }

        // if (!await uow.UserRepository.DoctorExistsAsync(doctorId, doctorId))
        //     return BadRequest($"Doctor de ID {doctorId} no fue encontrado o no existe para el doctor actual.");

        // if (!await uow.AddressRepository.ClinicExistsAsync(request.ClinicId, doctorId))
        //     return BadRequest($"Clinica de ID {request.PatientId} no fue encontrado o no existe para el doctor actual.");

        // if (!await uow.ServiceRepository.ExistsAsync(request.ServiceId, doctorId))
        //     return BadRequest($"Tratamiento de ID {request.ServiceId} no fue encontrado o no existe para el doctor actual.");

        // foreach (var nurseId in nurseIds)
        // {
        //     if (!await uow.UserRepository.NurseExistsAsync(nurseId, doctorId))
        //         return BadRequest($"Especialista de ID {nurseId} no fue encontrado o no existe para el doctor actual.");
        // }

        // Models.Entities.Event item = new(request.AllDay, request.DateFrom, request.DateTo, request.TimeFrom, request.TimeTo)
        // {
        //     NurseEvents = nurseIds.Select(x => new NurseEvent(x)).ToList(),
        //     EventService = new(request.ServiceId),
        //     PatientEvent = new(request.PatientId),
        //     EventClinic = new(request.ClinicId),
        //     DoctorEvent = new(doctorId),
        //     EventPaymentMethodType = request.PaymentMethodTypeId > 0 ? new(request.PaymentMethodTypeId) : null,
        //     EventMedicalInsuranceCompany = request.MedicalInsuranceCompanyId > 0 ? new(request.MedicalInsuranceCompanyId) : null
        // };

        // uow.EventRepository.Add(item);

        // if (!await uow.Complete()) return BadRequest($"Error al crear {subject}.");

        // string formattedDate = request.DateFrom.ToString("dd/MM/yyyy", CultureInfo.InvariantCulture);
        // string emailSubject = $"Mediverse: Confirmación de tu cita!";
        // string htmlMessage =  emailService.CreateAppointmentConfirmationEmail(doctor.FirstName + " " + doctor.LastName, formattedDate, request.TimeFrom + " - " + request.TimeTo, doctorService.Name);

        // await emailService.SendMail(patient.Email, emailSubject, htmlMessage);

        // var itemDto = await uow.EventRepository.GetDtoByIdAsync(item.Id);

        // return itemDto;
        return Ok();
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
        AppUser doctor = null;

        AppUser patient = await uow.UserRepository.GetByIdAsync(request.PatientId);
        if (patient == null) return BadRequest($"Paciente de ID {request.PatientId} no fue encontrado.");
        Service doctorService = await uow.ServiceRepository.GetByIdAsync(request.ServiceId);
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
                .Select(n => n.Value);
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

        if (!await uow.AddressRepository.ClinicExistsAsync(request.ClinicId, doctorId))
            return BadRequest($"Clinica de ID {request.PatientId} no fue encontrado o no existe para el doctor actual.");

        if (!await uow.ServiceRepository.ExistsAsync(request.ServiceId, doctorId))
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
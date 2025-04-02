using System.Net.Mail;
using AutoMapper;
using MainService.Core.DTOs.Events;
using MainService.Core.DTOs.Payment;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MainService.Core.Helpers.Pagination;
using MainService.Models.Entities;
using MainService.Core.DTOs.User;
using MainService.Core.Extensions;
using MainService.Core.Helpers.Params;
using MainService.Core.Interfaces.Services;
using MainService.Extensions;
using MainService.Models.Enums;
using Serilog;

namespace MainService.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class PaymentsController(IUnitOfWork uow, IMapper mapper, IStripeService stripeService, IEmailService emailService) : BaseApiController
    {
        private const int CommissionInCents = 5 * 100;

        [HttpGet]
        public async Task<ActionResult<PagedList<PaymentDto>>> GetPagedListAsync([FromQuery] PaymentParams param)
        {
            var pagedList = await uow.PaymentRepository.GetPagedListAsync(param);

            Response.AddPaginationHeader(new PaginationHeader(pagedList.CurrentPage, pagedList.PageSize,
                pagedList.TotalCount, pagedList.TotalPages));

            return pagedList;
        }

        [HttpGet("{id:int}")]
        public async Task<ActionResult<PaymentDto>> GetByIdAsync(int id)
        {
            var payment = await uow.PaymentRepository.GetByIdAsync(id);
            if (payment == null)
            {
                return NotFound($"Payment with ID {id} not found.");
            }

            return mapper.Map<PaymentDto>(payment);
        }

        [HttpGet("methods/{id:int}")]
        public async Task<ActionResult<List<UserPaymentMethodDto>>> GetPaymentMethodsByUserById(int id)
        {
            if (id != User.GetUserId())
                return Unauthorized("You are not authorized to access this user's payment methods.");

            var user = await uow.UserRepository.GetByIdAsync(id);
            if (user == null) return BadRequest("User not found.");

            return await uow.PaymentMethodRepository.GetAllByUserIdAsync(id);
        }
        
        [HttpPost("event/{eventId:int}/send-receipt")]
        [Authorize(Roles = "Doctor")]
        public async Task<IActionResult> SendEventReceiptEmail(int eventId, [FromBody] SendReceiptRequestDto request)
        {
            var doctorId = User.GetUserId();

            // 1. Fetch Event with necessary related data
            var eventItem = await uow.EventRepository.GetByIdAsync(eventId);

            // 2. Validations
            if (eventItem == null)
            {
                return NotFound($"Evento con ID {eventId} no encontrado.");
            }

            if (eventItem.DoctorEvent?.DoctorId != doctorId)
            {
                return Unauthorized("No está autorizado para enviar un comprobante para este evento.");
            }

            if (eventItem.PaymentStatus != PaymentStatus.Succeeded)
            {
                return BadRequest("El comprobante solo puede enviarse para eventos cuyo pago se haya completado exitosamente.");
            }

            var patient = eventItem.PatientEvent?.Patient;
            if (patient == null)
            {
                 return BadRequest("No se encontraron los detalles del paciente para este evento.");
            }

            var doctor = eventItem.DoctorEvent?.Doctor;
            if (doctor == null)
            {
                return BadRequest("No se encontraron los detalles del doctor para este evento.");
            }

            var service = eventItem.EventService?.Service;
            if (service == null)
            {
                return BadRequest("No se encontraron los detalles del servicio para este evento.");
            }

            var clinic = eventItem.EventClinic?.Clinic;

             // 3. Find the relevant Payment record
            var payment = eventItem.Payments
                .FirstOrDefault(p => p.PaymentStatus == PaymentStatus.Succeeded &&
                                     p.PaymentProcessingMode == PaymentProcessingMode.ManualConfirmation &&
                                     p.MarkedPaidByUserId == doctorId); 

            if (payment == null)
            {
                 payment = eventItem.Payments.FirstOrDefault(p => p.PaymentStatus == PaymentStatus.Succeeded);
            }

            if (payment == null)
            {
                return BadRequest("No se pudieron encontrar los detalles del pago para el comprobante de este evento.");
            }

            var paymentMethodName = payment.ManualPaymentDetail?.PaymentMethodType?.Name ?? "Desconocido";

            // 4. Prepare Email Content
             var patientFullName = $"{patient.FirstName} {patient.LastName}".Trim();
             var doctorFullName = $"{doctor.FirstName} {doctor.LastName}".Trim();
             var clinicName = clinic?.Name ?? "Clínica"; 

             var subject = $"Comprobante de Pago - Cita #{eventId} - {service.Name}";

            try
            {
                 var htmlBody = emailService.CreateEventReceiptEmail(
                    patientName: patientFullName,
                    doctorName: doctorFullName,
                    eventDate: eventItem.DateFrom ?? DateTime.UtcNow,
                    serviceName: service.Name,
                    amountPaid: payment.Amount, 
                    paymentMethodName: paymentMethodName,
                    paymentDate: payment.Date,
                    referenceNumber: payment.ManualPaymentDetail?.ReferenceNumber,
                    notes: payment.ManualPaymentDetail?.Notes,
                    eventId: eventItem.Id,
                    clinicName: clinicName
                );

                // 5. Send Email
                await emailService.SendMail(request.Email, subject, htmlBody);

                // 6. Update Event to mark receipt as sent
                eventItem.IsReceiptSent = true; 
                uow.EventRepository.Update(eventItem);


                if (!await uow.Complete())
                {
                    return BadRequest("Error al enviar el comprobante por correo electrónico.");
                }

                return Ok();
            }
            catch (SmtpException smtpEx)
            {
                 Log.Error(smtpEx, "SMTP Error sending receipt email for Event ID {EventId} to {Email}", eventId, request.Email);
                 return Problem("Hubo un problema al enviar el correo electrónico debido a un inconveniente con la red o el servidor de correo.", statusCode: StatusCodes.Status503ServiceUnavailable);
            }
            catch (Exception ex)
            {
                Log.Error(ex, "Error sending receipt email for Event ID {EventId} to {Email}", eventId, request.Email);
                return Problem("Ocurrió un error inesperado al intentar enviar el comprobante por correo electrónico.");
            }
        }

        [HttpPut("confirm-payment/event/{eventId:int}")]
        [Authorize(Roles = "Doctor")]
        public async Task<ActionResult<EventDto>> ConfirmManualPaymentForEvent(int eventId,
            [FromQuery] PaymentConfirmationParams @params)
        {
            var confirmingUserId = User.GetUserId();

            // 1. Validate Payment Method Type AND check if it's manual
            var paymentMethodType = await uow.PaymentMethodTypeRepository.GetByIdAsync(@params.SelectedPaymentMethodTypeId);
            if (paymentMethodType == null)
            {
                return BadRequest($"ID de Tipo de Método de Pago inválido: {@params.SelectedPaymentMethodTypeId}.");
            }

            // 2. Check if Doctor accepts this payment type
            var doctorAcceptsMethod = await uow.UserRepository.UserAcceptsPaymentMethodTypeByIdAsync(confirmingUserId,
                    @params.SelectedPaymentMethodTypeId);
            if (!doctorAcceptsMethod)
            {
                return BadRequest($"No has configurado tu cuenta para aceptar pagos del tipo '{paymentMethodType.Name}'.");
            }

            // 3. Get and Validate Event
            var eventItem = await uow.EventRepository.GetByIdAsync(eventId);
            if (eventItem == null)
            {
                return NotFound($"Evento con ID {eventId} no encontrado.");
            }

            // 4. Authorize: Ensure confirming doctor owns the event
            if (eventItem.DoctorEvent?.DoctorId != confirmingUserId)
            {
                return Unauthorized("Solo puedes confirmar pagos para tus propios eventos.");
            }

            // 5. Check Event Payment Status
            if (eventItem.PaymentStatus != PaymentStatus.AwaitingPayment)
            {
                return BadRequest($"El evento no está pendiente de pago (Actual: {eventItem.PaymentStatus}).");
            }

            // 6. Get Service and Amount
            var serviceEntity = eventItem.EventService?.Service;
            if (serviceEntity == null)
            {
                return BadRequest("Detalles del servicio no encontrados para el evento.");
            }

            var amount = serviceEntity.Price;
            var now = DateTime.UtcNow;

            // 7. Create Payment Entity
            var manualPayment = new Payment
            {
                Amount = amount,
                Currency = "mxn",
                Date = now,
                PaymentStatus = PaymentStatus.Succeeded,
                EventId = eventId,
                MarkedPaidByUserId = confirmingUserId,
                PaymentProcessingMode = PaymentProcessingMode.ManualConfirmation,
            };
            uow.PaymentRepository.Add(manualPayment);

            // 8. Create ManualPaymentDetail Entity
            var paymentDetail = new ManualPaymentDetail
            {
                Payment = manualPayment,
                PaymentMethodTypeId = @params.SelectedPaymentMethodTypeId,
                ReferenceNumber = @params.ReferenceNumber,
                Notes = @params.Notes
            };
            manualPayment.ManualPaymentDetail = paymentDetail;
            uow.ManualPaymentDetailRepository.Add(paymentDetail);


            // 9. Update Event Status
            eventItem.PaymentStatus = PaymentStatus.Succeeded;
            uow.EventRepository.Update(eventItem);


            // 10. Save Changes
            if (!await uow.Complete())
            {
                Log.Error("Failed to save manual payment confirmation for Event ID {EventId}", eventId);
                return BadRequest("Error al confirmar el pago y actualizar los registros. Por favor, inténtalo de nuevo.");
            }

            // 11. Return Updated Event DTO
            var updatedEventDto = await uow.EventRepository.GetDtoByIdAsync(eventId);
            if (updatedEventDto == null)
            {
                return Problem("Error al recuperar los detalles actualizados del evento después de guardar.");
            }

            return Ok(updatedEventDto);
        }

        [AllowAnonymous]
        [HttpGet("method-types/all")]
        public async Task<ActionResult<List<PaymentMethodTypeDto>>> GetAllPaymentMethodTypes()
        {
            return await uow.PaymentMethodTypeRepository.GetAllDtosAsync();
        }

        [HttpPost("create-payment-intent/order/{orderId:int}")]
        public async Task<ActionResult<CreatePaymentIntentResponseDto>> CreateOrderPaymentIntent(int orderId,
            [FromBody] CreatePaymentIntentRequestDto request)
        {
            var requestingUserId = User.GetUserId();

            var order = await uow.OrderRepository.GetByIdAsync(orderId);
            if (order == null)
                return NotFound($"Order with ID {orderId} not found.");

            var shippingAddress = await uow.AddressRepository.GetByIdAsync(request.AddressId);
            if (shippingAddress == null)
                return BadRequest($"Address with ID {request.AddressId} not found.");

            var paymentMethod = await uow.PaymentMethodRepository.GetByIdAsync(request.PaymentMethodId);
            if (paymentMethod == null)
                return BadRequest("Payment method not found.");

            if (paymentMethod.UserId != requestingUserId)
                return Unauthorized("You are not authorized to use this payment method.");

            var patientStripeCustomerId = paymentMethod.User.StripeCustomerId;
            if (string.IsNullOrEmpty(patientStripeCustomerId))
                return BadRequest("Patient does not have a Stripe customer account.");

            var doctor = await uow.UserRepository.GetByIdAsync(order.DoctorOrder.DoctorId);
            if (doctor == null)
                return BadRequest("Doctor not found for order.");

            var doctorStripeAccountId = doctor.StripeConnectAccountId;
            if (string.IsNullOrEmpty(doctorStripeAccountId))
            {
                var (account, accountLinkUrl) = await stripeService.CreateExpressAccountAsync(doctor);
                if (account == null || string.IsNullOrEmpty(account.Id))
                    return BadRequest("Doctor does not have a Stripe Connect account and creation failed.");

                doctor.StripeConnectAccountId = account.Id;

                uow.UserRepository.Update(doctor);
                await uow.Complete();

                doctorStripeAccountId = account.Id;

                if (!string.IsNullOrEmpty(accountLinkUrl))
                {
                    doctor.StripeOnboardingUrl = accountLinkUrl;
                    await uow.Complete();
                    return BadRequest(
                        $"Doctor account not fully onboarded. Please complete onboarding here: {accountLinkUrl}");
                }
            }

            var amountInCents = order.Total * 100;

            if (!amountInCents.HasValue) return BadRequest("Order total could not be calculated.");

            if (order.OrderDeliveryAddress == null)
            {
                order.OrderDeliveryAddress = new OrderDeliveryAddress
                {
                    AddressId = shippingAddress.Id
                };
            }
            else
            {
                if (order.OrderDeliveryAddress.AddressId != shippingAddress.Id)
                {
                    order.OrderDeliveryAddress.AddressId = shippingAddress.Id;
                }
            }

            var paymentIntent = await stripeService.CreatePaymentIntentAsync(
                patientStripeCustomerId,
                paymentMethod.StripePaymentMethodId!,
                doctorStripeAccountId,
                amountInCents.Value,
                CommissionInCents
            );

            if (paymentIntent == null)
                return BadRequest("PaymentIntent creation failed.");

            var payment = new Payment
            {
                Amount = amountInCents.Value,
                Currency = "mxn",
                Date = DateTime.Now.ToUniversalTime(),
                PaymentStatus = PaymentStatus.Succeeded,
                StripePaymentIntent = paymentIntent.Id,
                StripePaymentId = paymentIntent.LatestChargeId,
                StripeInvoiceId = paymentIntent.InvoiceId,
                Order = order,
                PaymentMethod = paymentMethod
            };

            order.Payments.Add(payment);

            order.OrderHistories.Add(new OrderHistory
            {
                UserId = requestingUserId,
                ChangeType = OrderChangeType.PaymentProcessed,
                Property = OrderProperty.PaymentStatus,
                OldValue = order.PaymentStatus.ToString(),
                NewValue = PaymentStatus.Succeeded.ToString(),
            });

            var amountInMxn = amountInCents.Value / 100m;

            order.PaymentStatus = PaymentStatus.Succeeded;
            order.AmountPaid = (order.AmountPaid ?? 0) + amountInMxn;
            order.AmountDue = (order.AmountDue ?? order.Total ?? 0) - amountInMxn;

            if (!await uow.Complete())
                return BadRequest("Failed to save payment and update order details.");

            return Ok(new CreatePaymentIntentResponseDto
            {
                ClientSecret = paymentIntent.ClientSecret,
                PaymentId = payment.Id
            });
        }

        [HttpPost("create-payment-intent/event/{eventId:int}")]
        public async Task<ActionResult<CreatePaymentIntentResponseDto>> CreateEventPaymentIntent(int eventId,
            [FromBody] CreatePaymentIntentRequestDto request)
        {
            var eventItem = await uow.EventRepository.GetByIdAsync(eventId);
            if (eventItem == null)
                return NotFound($"Event with ID {eventId} not found.");

            var billingAddress = await uow.AddressRepository.GetByIdAsync(request.AddressId);
            if (billingAddress == null)
                return BadRequest($"Address with ID {request.AddressId} not found.");

            var paymentMethod = await uow.PaymentMethodRepository.GetByIdAsync(request.PaymentMethodId);
            if (paymentMethod == null)
                return BadRequest("Payment method not found.");

            if (paymentMethod.UserId != User.GetUserId())
                return Unauthorized("You are not authorized to use this payment method.");

            var patientStripeCustomerId = paymentMethod.User.StripeCustomerId;
            if (string.IsNullOrEmpty(patientStripeCustomerId))
                return BadRequest("Patient does not have a Stripe customer account.");

            var doctor = await uow.UserRepository.GetByIdAsync(eventItem.DoctorEvent.DoctorId);
            if (doctor == null)
                return BadRequest("Doctor not found for event.");

            var doctorStripeAccountId = doctor.StripeConnectAccountId;
            if (string.IsNullOrEmpty(doctorStripeAccountId))
            {
                var (account, accountLinkUrl) = await stripeService.CreateExpressAccountAsync(doctor);
                if (account == null || string.IsNullOrEmpty(account.Id))
                    return BadRequest("Doctor does not have a Stripe Connect account and creation failed.");

                doctor.StripeConnectAccountId = account.Id;
                uow.UserRepository.Update(doctor);

                await uow.Complete();
                doctorStripeAccountId = account.Id;

                if (!string.IsNullOrEmpty(accountLinkUrl))
                {
                    doctor.StripeOnboardingUrl = accountLinkUrl;
                    await uow.Complete();
                    return BadRequest(
                        $"Doctor account not fully onboarded. Please complete onboarding here: {accountLinkUrl}");
                }
            }

            var serviceEntity = await uow.ServiceRepository.GetByIdAsync(eventItem.EventService.ServiceId);
            if (serviceEntity == null)
                return BadRequest("Service not found for event.");

            var amountInCents = serviceEntity.Price * 100;

            eventItem.BillingAddressId = billingAddress.Id;

            var paymentIntent = await stripeService.CreatePaymentIntentAsync(
                patientStripeCustomerId,
                paymentMethod.StripePaymentMethodId!,
                doctorStripeAccountId,
                amountInCents,
                CommissionInCents
            );

            if (paymentIntent == null)
                return BadRequest("PaymentIntent creation failed.");

            var payment = new Payment
            {
                Amount = amountInCents,
                Currency = "mxn",
                Date = DateTime.Now.ToUniversalTime(),
                PaymentStatus = PaymentStatus.Succeeded,
                StripePaymentIntent = paymentIntent.Id,
                StripePaymentId = paymentIntent.LatestChargeId,
                StripeInvoiceId = paymentIntent.InvoiceId,
                Event = eventItem,
                PaymentMethod = paymentMethod
            };

            eventItem.Payments.Add(payment);
            eventItem.PaymentStatus = PaymentStatus.Succeeded;

            if (!await uow.Complete())
                return BadRequest("Failed to save payment and update event details.");

            return Ok(new CreatePaymentIntentResponseDto
            {
                ClientSecret = paymentIntent.ClientSecret,
                PaymentId = payment.Id
            });
        }

        [HttpPost]
        public async Task<ActionResult<PaymentDto>> CreateAsync([FromBody] PaymentDto paymentDto)
        {
            var payment = mapper.Map<Payment>(paymentDto);
            uow.PaymentRepository.Add(payment);
            await uow.Complete();

            var resultDto = mapper.Map<PaymentDto>(payment);
            return CreatedAtAction(nameof(GetByIdAsync), new { id = payment.Id }, resultDto);
        }

        [HttpPut("{id:int}")]
        public async Task<ActionResult<PaymentDto>> UpdateAsync(int id, [FromBody] PaymentDto paymentDto)
        {
            if (id != paymentDto.Id)
            {
                return BadRequest("Payment ID mismatch.");
            }

            var payment = await uow.PaymentRepository.GetByIdAsync(id);
            if (payment == null)
            {
                return NotFound($"Payment with ID {id} not found.");
            }

            mapper.Map(paymentDto, payment);
            await uow.Complete();

            return mapper.Map<PaymentDto>(payment);
        }

        [HttpDelete("{id:int}")]
        public async Task<ActionResult> DeleteAsync(int id)
        {
            var payment = await uow.PaymentRepository.GetByIdAsync(id);
            if (payment == null)
            {
                return NotFound($"Payment with ID {id} not found.");
            }

            uow.PaymentRepository.Delete(payment);
            await uow.Complete();

            return Ok();
        }
    }
}
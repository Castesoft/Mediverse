using AutoMapper;
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

namespace MainService.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class PaymentsController(IUnitOfWork uow, IMapper mapper, IStripeService stripeService) : BaseApiController
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

        [HttpPost("create-payment-intent/order/{orderId:int}")]
        public async Task<ActionResult<CreatePaymentIntentResponseDto>> CreateOrderPaymentIntent(int orderId,
            [FromBody] CreatePaymentIntentRequestDto request)
        {
            var requestingUserId = User.GetUserId();

            var order = await uow.OrderRepository.GetByIdAsync(orderId);
            if (order == null)
                return NotFound($"Order with ID {orderId} not found.");

            var paymentMethod = await uow.PaymentMethodRepository.GetByIdAsync(request.PaymentMethodId);
            if (paymentMethod == null)
                return BadRequest("Payment method not found.");

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
                    return BadRequest(
                        $"Doctor account not fully onboarded. Please complete onboarding here: {accountLinkUrl}");
                }
            }

            var amountInCents = order.Total * 100;

            if (!amountInCents.HasValue) return BadRequest("Order total could not be calculated.");

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
            order.AmountPaid += amountInMxn;
            order.AmountDue -= amountInMxn;

            if (!await uow.Complete())
                return BadRequest("Payment creation failed.");

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

            var paymentMethod = await uow.PaymentMethodRepository.GetByIdAsync(request.PaymentMethodId);
            if (paymentMethod == null)
                return BadRequest("Payment method not found.");

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
                    return BadRequest(
                        $"Doctor account not fully onboarded. Please complete onboarding here: {accountLinkUrl}");
                }
            }

            var serviceEntity = await uow.ServiceRepository.GetByIdAsync(eventItem.EventService.ServiceId);
            if (serviceEntity == null)
                return BadRequest("Service not found for event.");

            var amountInCents = serviceEntity.Price * 100;

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
                return BadRequest("Payment creation failed.");

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
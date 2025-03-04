using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MainService.Core.Helpers.Pagination;
using MainService.Models.Entities;
using MainService.Core.Extensions;
using MainService.Core.DTOs.Subscriptions;
using MainService.Core.Helpers.Params;
using MainService.Core.Interfaces.Services;
using MainService.Extensions;
using MainService.Models.Helpers.Enums;

namespace MainService.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class SubscriptionsController(IUnitOfWork uow, IMapper mapper, IStripeService stripeService, IConfiguration configuration) : BaseApiController
    {
        [HttpGet]
        public async Task<ActionResult<PagedList<SubscriptionDto>>> GetPagedListAsync(
            [FromQuery] SubscriptionParams param)
        {
            if (param.FromSection != SiteSection.Admin)
            {
                param.DoctorId = User.GetUserId();
            }

            var pagedList = await uow.SubscriptionRepository.GetPagedListAsync(param);

            Response.AddPaginationHeader(new PaginationHeader(
                pagedList.CurrentPage,
                pagedList.PageSize,
                pagedList.TotalCount,
                pagedList.TotalPages
            ));

            return pagedList;
        }
        
        [HttpPost]
        public async Task<ActionResult<SubscriptionDto?>> CreateSubscriptionAsync([FromBody] SubscriptionCreateDto request)
        {
            var requestingUserId = User.GetUserId();
            
            var requestingUser = await uow.UserRepository.GetByIdAsync(requestingUserId);
            if (requestingUser == null) return NotFound("El usuario no existe.");
            
            var activeSubscription = await uow.SubscriptionRepository.GetActiveSubscriptionForUserAsync(requestingUserId);
            if (activeSubscription != null) return BadRequest("El usuario ya tiene una suscripción activa.");
            
            var stripePriceId = configuration["StripeSettings:PriceId"];
            if (string.IsNullOrEmpty(stripePriceId)) throw new Exception("Stripe price ID is not set in configuration.");

            var subscription = new UserSubscription
            {
                StartDate = DateTime.Now.ToUniversalTime(),
                EndDate = null,
                Status = SubscriptionStatus.Pending,
                NextBillingDate = null,
                StripeSubscriptionId = null,
                StripeCustomerId = requestingUser.StripeCustomerId,
                SubscriptionHistories = [],
                UserId = requestingUserId,
                SubscriptionPlanId = 3,
            };

            if (string.IsNullOrEmpty(subscription.StripeCustomerId))
            {
                var paymentMethod = await uow.PaymentMethodRepository.GetByIdAsync(request.PaymentMethodId);
                if (paymentMethod == null) return NotFound("El método de pago seleccionado no existe.");
                if (paymentMethod.UserId != requestingUserId) return Unauthorized("El método de pago seleccionado no pertenece al usuario.");
                if (string.IsNullOrEmpty(paymentMethod.StripePaymentMethodId)) return BadRequest("El método de pago seleccionado no tiene un ID de método de pago de Stripe.");
                
                if (string.IsNullOrEmpty(requestingUser.StripeCustomerId))
                {
                    requestingUser.StripeCustomerId = await stripeService.CreateCustomerAsync(requestingUser.Email, $"{requestingUser.FirstName} {requestingUser.LastName}", paymentMethod.StripePaymentMethodId);
                    await uow.Complete();
                }

                subscription.StripeCustomerId = requestingUser.StripeCustomerId;
            }

            try
            {
                var stripeSubscriptionId = await stripeService.CreateStripeSubscriptionAsync(subscription.StripeCustomerId, stripePriceId);
                subscription.StripeSubscriptionId = stripeSubscriptionId;
                subscription.Status = SubscriptionStatus.Pending;
                subscription.StartDate = DateTime.UtcNow;
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, "Error al crear la suscripción en Stripe: " + ex.Message);
            }

            uow.SubscriptionRepository.Add(subscription);
            await uow.Complete();

            return await uow.SubscriptionRepository.GetDtoByIdAsync(subscription.Id);
        }


        [HttpGet("{id:int}")]
        public async Task<ActionResult<SubscriptionDto>> GetByIdAsync(int id)
        {
            var subscription = await uow.SubscriptionRepository.GetByIdAsync(id);
            if (subscription == null) return NotFound($"Subscription with ID {id} not found.");

            return mapper.Map<SubscriptionDto>(subscription);
        }

        [HttpPut("{id:int}")]
        public async Task<ActionResult<SubscriptionDto>> UpdateSubscriptionAsync(int id,
            [FromBody] SubscriptionDto subscriptionDto)
        {
            if (id != subscriptionDto.Id)
            {
                return BadRequest("Subscription ID mismatch.");
            }

            var subscription = await uow.SubscriptionRepository.GetByIdAsync(id);
            if (subscription == null)
            {
                return NotFound($"Subscription with ID {id} not found.");
            }

            mapper.Map(subscriptionDto, subscription);
            await uow.Complete();

            return mapper.Map<SubscriptionDto>(subscription);
        }

        [HttpDelete("{id:int}")]
        public async Task<ActionResult> DeleteSubscriptionAsync(int id, [FromBody] SubscriptionDeleteDto request)
        {
            var subscription = await uow.SubscriptionRepository.GetByIdAsync(id);
            if (subscription == null)
            {
                return NotFound($"Subscription with ID {id} not found.");
            }
            
            var requestingUserId = User.GetUserId();
            if (subscription.UserId != requestingUserId)
            {
                return Unauthorized("You are not authorized to delete this subscription.");
            }
            
            var requestingUser = await uow.UserRepository.GetByIdAsync(requestingUserId);
            if (requestingUser == null)
            {
                return NotFound("El usuario no existe.");
            }

            var subscriptionCancellation = new SubscriptionCancellation
            {
                CancellationDate = new DateTime().ToUniversalTime(),
                TooExpensive = request.TooExpensive,
                NotEnoughUse = request.NotEnoughUse,
                FoundAlternative = request.FoundAlternative,
                MissingFeatures = request.MissingFeatures,
                TechnicalProblems = request.TechnicalProblems,
                PoorSupport = request.PoorSupport,
                OtherReason = request.OtherReason,
                Feedback = request.Feedback,
                UserSubscription = subscription,
                User = requestingUser
            };
            uow.SubscriptionCancellationRepository.Add(subscriptionCancellation);



            // uow.SubscriptionRepository.Delete(subscription);
            await uow.Complete();

            return Ok();
        }
    }
}
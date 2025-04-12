using MainService.Core.Interfaces.Services;
using Microsoft.AspNetCore.Mvc;
using Stripe;
using MainService.Models.Helpers;
using MainService.Models.Entities; 

namespace MainService.Controllers
{
    [Route("api/stripe/webhook")]
    [ApiController]
    public class StripeWebhookController(IUnitOfWork uow, IConfiguration config) : ControllerBase
    {
        [HttpPost]
        public async Task<IActionResult> HandleStripeWebhook()
        {
            var json = await new StreamReader(HttpContext.Request.Body).ReadToEndAsync();
            var stripeSignature = Request.Headers["Stripe-Signature"];
            var webhookSecret = config["StripeSettings:WebhookSecret"];
            Stripe.Event stripeEvent;
            try
            {
                stripeEvent = EventUtility.ConstructEvent(json, stripeSignature, webhookSecret);
            }
            catch (StripeException ex)
            {
                return BadRequest($"Webhook error: {ex.Message}");
            }

            switch (stripeEvent.Type)
            {
                case EventTypes.PaymentIntentSucceeded or EventTypes.PaymentIntentPaymentFailed:
                {
                    if (stripeEvent.Data.Object is PaymentIntent paymentIntent)
                    {
                        var payment = await uow.PaymentRepository.GetByStripePaymentIntentAsync(paymentIntent.Id);
                        if (payment != null)
                        {
                            payment.PaymentStatus = Utils.MapStripeStatusToPaymentStatus(paymentIntent.Status);
                            await uow.Complete();
                        }
                    }

                    break;
                }
                case "customer.subscription.created"
                    or "customer.subscription.updated"
                    or "customer.subscription.deleted":
                {
                    if (stripeEvent.Data.Object is not Subscription stripeSubscription) return Ok();

                    var newStatus = stripeSubscription.Status switch
                    {
                        "active" => SubscriptionStatus.Active,
                        "incomplete" or "incomplete_expired" or "past_due" => SubscriptionStatus.Pending,
                        "canceled" => SubscriptionStatus.Cancelled,
                        "unpaid" => SubscriptionStatus.Expired,
                        _ => SubscriptionStatus.Pending
                    };

                    var subscription =
                        await uow.SubscriptionRepository.GetByStripeSubscriptionIdAsync(stripeSubscription.Id);

                    if (subscription == null) return Ok();

                    subscription.Status = newStatus;
                    await uow.Complete();
                    break;
                }
            }

            

            return Ok();
        }
    }
}
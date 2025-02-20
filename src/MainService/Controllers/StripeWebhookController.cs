using MainService.Core.Interfaces.Services;
using Microsoft.AspNetCore.Mvc;
using Stripe;
using MainService.Models.Helpers;

namespace MainService.Controllers
{
    [Route("api/stripe")]
    [ApiController]
    public class StripeWebhookController(IUnitOfWork uow, IConfiguration config) : ControllerBase
    {
        [HttpPost("webhook")]
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
            catch (StripeException)
            {
                return BadRequest();
            }

            if (stripeEvent.Type is EventTypes.PaymentIntentSucceeded or EventTypes.PaymentIntentPaymentFailed)
            {
                var paymentIntent = stripeEvent.Data.Object as PaymentIntent;
                if (paymentIntent == null) return Ok();
                
                // Retrieve the Payment record by StripePaymentIntent (the PaymentIntent ID)
                var payment = await uow.PaymentRepository.GetByStripePaymentIntentAsync(paymentIntent.Id);
                if (payment == null) return Ok();
                
                payment.PaymentStatus = Utils.MapStripeStatusToPaymentStatus(paymentIntent.Status);
                await uow.Complete();
            }
            
            // TODO - Additional event types can be handled here as needed.

            return Ok();
        }
    }
}
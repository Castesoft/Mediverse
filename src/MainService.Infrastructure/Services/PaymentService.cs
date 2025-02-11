using AutoMapper;
using MainService.Core.DTOs.User;
using MainService.Core.Interfaces.Services;
using MainService.Models.Entities;

namespace MainService.Infrastructure.Services;

public class PaymentService(IUnitOfWork uow, IMapper mapper, IStripeService stripeService) : IPaymentService
{
    private const int CommissionInCents = 5 * 100;
    
    public async Task<PaymentDto> CreatePaymentAsync(PaymentDto paymentDto)
    {
        var amountInCents = (long)(paymentDto.Amount * 100);

        var paymentIntent = await stripeService.CreatePaymentIntentAsync(
            paymentDto.CustomerStripeId,
            paymentDto.PaymentMethodId,
            null, // (For now, we pass null as the doctor’s Stripe Account ID.)
            amountInCents,
            CommissionInCents
        );

        if (paymentIntent == null) throw new Exception("Error creating payment intent.");

        var status = MapStripeStatus(paymentIntent.Status);

        var payment = new Payment
        {
            Amount = paymentDto.Amount,
            Currency = paymentDto.Currency,
            Date = DateTime.UtcNow,
            StripePaymentIntent = paymentIntent.Id,
            PaymentStatus = status,
            EventId = paymentDto.EventId
        };

        uow.PaymentRepository.Add(payment);
        await uow.Complete();

        return mapper.Map<PaymentDto>(payment);
    }

    /// <summary>
    /// Maps a Stripe PaymentIntent status string to our PaymentStatus.
    /// </summary>
    private PaymentStatus MapStripeStatus(string stripeStatus)
    {
        return stripeStatus switch
        {
            "succeeded" => PaymentStatus.Succeeded,
            "processing" => PaymentStatus.Processing,
            "requires_capture" => PaymentStatus.RequiresCapture,
            "requires_payment_method" => PaymentStatus.RequiresPaymentMethod,
            "requires_confirmation" => PaymentStatus.RequiresConfirmation,
            "requires_action" => PaymentStatus.RequiresAction,
            "canceled" => PaymentStatus.Canceled,
            _ => PaymentStatus.Processing
        };
    }
}
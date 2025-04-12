using MainService.Core.DTOs.Payment;

namespace MainService.Core.Interfaces.Services;

public interface IPaymentService
{
    Task<PaymentDto> CreatePaymentAsync(PaymentDto paymentDto);
}
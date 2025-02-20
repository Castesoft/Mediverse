using MainService.Core.DTOs.Payment;
using MainService.Core.DTOs.User;

namespace MainService.Core.Interfaces.Services;

public interface IPaymentService
{
    Task<PaymentDto> CreatePaymentAsync(PaymentDto paymentDto);
}
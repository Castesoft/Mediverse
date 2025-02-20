using MainService.Core.DTOs.Payment;
using MainService.Core.Helpers.Pagination;
using MainService.Core.Helpers.Params;
using MainService.Models.Entities;

namespace MainService.Core.Interfaces.Data;

public interface IPaymentRepository
{
    void Add(Payment payment);
    Task<Payment?> GetByIdAsync(int id);
    Task<List<Payment>> GetPaymentsByEventIdAsync(int eventId);
    Task<PagedList<PaymentDto>> GetPagedListAsync(PaymentParams param);
    Task<Payment?> GetByStripePaymentIntentAsync(string stripePaymentIntent);
    void Delete(Payment payment);
}
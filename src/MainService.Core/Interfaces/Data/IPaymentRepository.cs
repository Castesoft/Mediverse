using MainService.Models.Entities;

namespace MainService.Core.Interfaces.Data;

public interface IPaymentRepository
{
    void Add(Payment payment);
    Task<Payment?> GetByIdAsync(int id);
    Task<List<Payment>> GetPaymentsByEventIdAsync(int eventId);
}
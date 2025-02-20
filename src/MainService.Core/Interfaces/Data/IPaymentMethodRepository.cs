using MainService.Core.DTOs.User;
using MainService.Models.Entities;

namespace MainService.Core.Interfaces.Data;

public interface IPaymentMethodRepository
{
    void Add(PaymentMethod item);
    void Delete(PaymentMethod item);
    Task<PaymentMethod?> GetByIdAsync(int id);
    Task<List<UserPaymentMethodDto>> GetAllByUserIdAsync(int userId);
    Task<PaymentMethod?> GetByIdAsNoTrackingAsync(int id);
    Task<List<PaymentMethod>> GetAllAsync();
}
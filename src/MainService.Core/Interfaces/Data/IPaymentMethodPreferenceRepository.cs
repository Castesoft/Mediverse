using System.Linq.Expressions;
using MainService.Core.DTOs.Payment;
using MainService.Models.Entities;

namespace MainService.Core.Interfaces.Data
{
    public interface IPaymentMethodPreferenceRepository
    {
        void Add(PaymentMethodPreference preference);
        void Update(PaymentMethodPreference preference);
        void Delete(PaymentMethodPreference preference);
        Task<List<PaymentMethodPreferenceDto>> GetByUserIdAsync(int userId);
        Task<PaymentMethodPreferenceDto> GetByUserIdAndPaymentMethodTypeIdAsync(int userId, int paymentMethodTypeId);
        Task<PaymentMethodPreference> GetEntityByUserIdAndPaymentMethodTypeIdAsync(int userId, int paymentMethodTypeId);
        Task<IQueryable<PaymentMethodPreference>> FindByConditionAsync(Expression<Func<PaymentMethodPreference, bool>> predicate);
        Task UnsetDefaultForUserAsync(int userId);
    }
}
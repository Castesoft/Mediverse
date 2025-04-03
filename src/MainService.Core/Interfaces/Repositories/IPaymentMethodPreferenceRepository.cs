using MainService.Core.DTOs.Payment;
using MainService.Models.Entities;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace MainService.Core.Interfaces.Repositories
{
    public interface IPaymentMethodPreferenceRepository
    {
        void Add(PaymentMethodPreference preference);
        void Update(PaymentMethodPreference preference);
        void Delete(PaymentMethodPreference preference);
        Task<List<PaymentMethodPreferenceDto>> GetByUserIdAsync(int userId);
        Task<PaymentMethodPreferenceDto> GetByUserIdAndPaymentMethodTypeIdAsync(int userId, int paymentMethodTypeId);
        Task<PaymentMethodPreference> GetEntityByUserIdAndPaymentMethodTypeIdAsync(int userId, int paymentMethodTypeId);
        Task UnsetDefaultForUserAsync(int userId);
    }
}
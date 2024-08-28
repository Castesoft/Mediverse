using MainService.Models.Entities;
using Stripe;

namespace MainService.Core.Interfaces.Services
{
    public interface IStripeService
    {
        Task<string> CreateCustomerAsync(string email, string name, string paymentMethodId);
        Task<Account> CreateExpressAccountAsync(AppUser user);
        Task<bool> AddPaymentMethodAsync(string customerId, string paymentMethodId, bool isMain);
        Task<bool> DeletePaymentMethodAsync(string paymentMethodId);
        Task<bool> SetMainPaymentMethodAsync(string customerId, string paymentMethodId);
        Task<PaymentIntent> CreatePaymentIntentAsync(string customerId, string paymentMethodId, string doctorStripeAccountId, decimal amountInCents, decimal commissionInCents);
    }
}
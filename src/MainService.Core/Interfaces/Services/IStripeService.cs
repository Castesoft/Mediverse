namespace MainService.Core.Interfaces.Services
{
    public interface IStripeService
    {
        Task<string> CreateCustomerAsync(string email, string name, string paymentMethodId);
        Task<bool> AddPaymentMethodAsync(string customerId, string paymentMethodId, bool isMain);
        Task<bool> DeletePaymentMethodAsync(string paymentMethodId);
        Task<bool> SetMainPaymentMethodAsync(string customerId, string paymentMethodId);
    }
}
namespace MainService.Core.Interfaces.Services
{
    public interface IStripeService
    {
        Task<string> CreateCustomerAsync(string email, string name, string paymentMethodId);
    }
}
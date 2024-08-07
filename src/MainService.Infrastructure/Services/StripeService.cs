using MainService.Core.Interfaces.Services;
using Microsoft.Extensions.Configuration;
using Stripe;

namespace MainService.Infrastructure.Services
{
    public class StripeService(IConfiguration config) : IStripeService
    {
        public async Task<string> CreateCustomerAsync(string email, string name, string paymentMethodId)
        {
            StripeConfiguration.ApiKey = config["StripeSettings:SecretKey"];

            var customerService = new CustomerService();
            Customer customer = await customerService.CreateAsync(new CustomerCreateOptions
            {
                Email = email,
                Name = name,
                PaymentMethod = paymentMethodId
            });

            return customer.Id;
        }
    }
}
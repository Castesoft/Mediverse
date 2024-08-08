using MainService.Core.Interfaces.Services;
using Microsoft.Extensions.Configuration;
using Stripe;

namespace MainService.Infrastructure.Services
{
    public class StripeService(IConfiguration config) : IStripeService
    {
        public async Task<bool> AddPaymentMethodAsync(string customerId, string paymentMethodId, bool isMain)
        {
            StripeConfiguration.ApiKey = config["StripeSettings:SecretKey"];

            var service = new PaymentMethodService();
            PaymentMethodAttachOptions options = new() { Customer = customerId };
            PaymentMethod paymentMethod = await service.AttachAsync(paymentMethodId, options);

            if (paymentMethod.Id == null) return false;

            if (isMain)
            {
                var customerService = new CustomerService();
                await customerService.UpdateAsync(customerId, new CustomerUpdateOptions
                {
                    InvoiceSettings = new CustomerInvoiceSettingsOptions
                    {
                        DefaultPaymentMethod = paymentMethodId
                    }
                });
            }

            return true;
        }

        public async Task<string> CreateCustomerAsync(string email, string name, string paymentMethodId)
        {
            StripeConfiguration.ApiKey = config["StripeSettings:SecretKey"];

            var customerService = new CustomerService();
            Customer customer = await customerService.CreateAsync(new CustomerCreateOptions
            {
                Email = email,
                Name = name,
                PaymentMethod = paymentMethodId,
                InvoiceSettings = new CustomerInvoiceSettingsOptions
                {
                    DefaultPaymentMethod = paymentMethodId
                }
            });

            return customer.Id;
        }

        public async Task<bool> DeletePaymentMethodAsync(string paymentMethodId)
        {
            StripeConfiguration.ApiKey = config["StripeSettings:SecretKey"];

            var service = new PaymentMethodService();
            try
            {
                await service.DetachAsync(paymentMethodId);
            }
            catch (StripeException)
            {
                return true;
            }
            return true;
        }

        public async Task<bool> SetMainPaymentMethodAsync(string customerId, string paymentMethodId)
        {
            StripeConfiguration.ApiKey = config["StripeSettings:SecretKey"];

            var customerService = new CustomerService();
            await customerService.UpdateAsync(customerId, new CustomerUpdateOptions
            {
                InvoiceSettings = new CustomerInvoiceSettingsOptions
                {
                    DefaultPaymentMethod = paymentMethodId
                }
            });

            return true;
        }
    }
}
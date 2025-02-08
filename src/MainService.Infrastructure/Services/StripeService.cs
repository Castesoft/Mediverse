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
            var options = new PaymentMethodAttachOptions { Customer = customerId };
            var paymentMethod = await service.AttachAsync(paymentMethodId, options);

            if (paymentMethod.Id == null) return false;

            if (!isMain) return true;

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

        public async Task<string> CreateCustomerAsync(string email, string name, string paymentMethodId)
        {
            StripeConfiguration.ApiKey = config["StripeSettings:SecretKey"];

            var customerService = new CustomerService();
            var customer = await customerService.CreateAsync(new CustomerCreateOptions
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

        public async Task<Account> CreateExpressAccountAsync(Models.Entities.AppUser user)
        {
            StripeConfiguration.ApiKey = config["StripeSettings:SecretKey"];

            var accountService = new AccountService();

            AccountCreateOptions options = new()
            {
                Type = AccountType.Express,
                Country = "MX",
                Email = user.Email,
                // Capabilities = new AccountCapabilitiesOptions
                // {
                //     CardPayments = new AccountCapabilitiesCardPaymentsOptions
                //     {
                //         Requested = true,
                //     },
                //     Transfers = new AccountCapabilitiesTransfersOptions
                //     {
                //         Requested = true,
                //     },
                // },
                // BusinessType = "individual",
                // Individual = new AccountIndividualOptions
                // {
                //     Email = user.Email,
                //     FirstName = user.FirstName,
                //     LastName = user.LastName,
                //     Dob = new DobOptions
                //     {
                //         Day = user.DateOfBirth.Day,
                //         Month = user.DateOfBirth.Month,
                //         Year = user.DateOfBirth.Year,
                //     },
                //     Address = new AddressOptions
                //     {
                //         City = user.UserAddresses.FirstOrDefault()?.Address.City,
                //         Country = user.UserAddresses.FirstOrDefault()?.Address.Country,
                //         Line1 = user.UserAddresses.FirstOrDefault()?.Address.Street,
                //         PostalCode = user.UserAddresses.FirstOrDefault()?.Address.Zipcode,
                //         State = user.UserAddresses.FirstOrDefault()?.Address.State,
                //     },
                //     Phone = user.PhoneNumber,

                // },
                // ExternalAccount = new AccountExternalAccountOptions
                // {
                //     Object = "bank_account",
                //     Country = "MX",
                //     Currency = "mxn",
                //     AccountNumber = "000123456789",
                //     RoutingNumber = "110000000",
                // },
            };

            return await accountService.CreateAsync(options);
        }

        public async Task<PaymentIntent?> CreatePaymentIntentAsync(string customerId, string paymentMethodId,
            string doctorStripeAccountId, decimal amountInCents, decimal commissionInCents)
        {
            StripeConfiguration.ApiKey = config["StripeSettings:SecretKey"];

            PaymentIntentCreateOptions options = new()
            {
                Amount = (long?)amountInCents,
                Currency = "mxn",
                Customer = customerId,
                PaymentMethod = paymentMethodId,
                Confirm = true,
                OffSession = true,
                TransferData = new PaymentIntentTransferDataOptions
                {
                    Destination = doctorStripeAccountId,
                },
                ApplicationFeeAmount = (long?)commissionInCents,
            };

            var service = new PaymentIntentService();
            return await service.CreateAsync(options);
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
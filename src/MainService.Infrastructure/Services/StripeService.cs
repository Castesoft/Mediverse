using MainService.Core.Interfaces.Services;
using MainService.Core.Settings;
using Microsoft.Extensions.Options;
using Serilog;
using Stripe;

namespace MainService.Infrastructure.Services
{
    public class StripeService(IOptions<StripeSettings> stripeSettings) : IStripeService
    {
        private readonly StripeSettings _stripeSettings = stripeSettings.Value;

        public async Task<bool> AddPaymentMethodAsync(string customerId, string paymentMethodId, bool isMain)
        {
            StripeConfiguration.ApiKey = _stripeSettings.SecretKey;

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

        public async Task<(string SubscriptionId, DateTime NextBillingDate)> CreateStripeSubscriptionAsync(
            string stripeCustomerId, string priceId)
        {
            StripeConfiguration.ApiKey = _stripeSettings.SecretKey;

            var options = new SubscriptionCreateOptions
            {
                Customer = stripeCustomerId,
                Items = [new SubscriptionItemOptions { Price = priceId }],
                Expand = ["latest_invoice.payment_intent"]
            };

            var service = new SubscriptionService();
            try
            {
                var stripeSubscription = await service.CreateAsync(options);
                var nextBillingDate = stripeSubscription.CurrentPeriodEnd;
                return (stripeSubscription.Id, nextBillingDate);
            }
            catch (StripeException ex)
            {
                throw new Exception("Error creating Stripe subscription: " + ex.Message, ex);
            }
        }

        public async Task<string> CreateCustomerAsync(string email, string name, string paymentMethodId)
        {
            StripeConfiguration.ApiKey = _stripeSettings.SecretKey;

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

        public async Task<(Account account, string? accountLinkUrl)> CreateExpressAccountAsync(
            Models.Entities.AppUser user)
        {
            StripeConfiguration.ApiKey = _stripeSettings.SecretKey;

            if (string.IsNullOrEmpty(user.Email))
                throw new ArgumentException("User email is required for account creation.");

            if (string.IsNullOrEmpty(user.FirstName) || string.IsNullOrEmpty(user.LastName))
                throw new ArgumentException("User first and last name are required for account creation.");

            if (!user.DateOfBirth.HasValue)
                throw new ArgumentException("User date of birth is required for account creation.");

            var address = user.UserAddresses.FirstOrDefault()?.Address;
            if (address == null)
                throw new ArgumentException("A valid user address is required for account creation.");

            if (string.IsNullOrEmpty(address.CountryCode) || address.CountryCode.Length != 2)
                throw new ArgumentException("A valid 2-letter country code is required in the user address.");

            var accountService = new AccountService();

            var options = new AccountCreateOptions
            {
                Type = AccountType.Express,
                Country = address.CountryCode,
                Email = user.Email,
                BusinessType = "individual",
                Capabilities = new AccountCapabilitiesOptions
                {
                    CardPayments = new AccountCapabilitiesCardPaymentsOptions { Requested = true },
                    Transfers = new AccountCapabilitiesTransfersOptions { Requested = true },
                },
                Individual = new AccountIndividualOptions
                {
                    FirstName = user.FirstName,
                    LastName = user.LastName,
                    Email = user.Email,
                    Dob = new DobOptions
                    {
                        Day = user.DateOfBirth.Value.Day,
                        Month = user.DateOfBirth.Value.Month,
                        Year = user.DateOfBirth.Value.Year,
                    },
                    Address = new AddressOptions
                    {
                        City = address.City,
                        Country = address.CountryCode,
                        Line1 = address.Street,
                        PostalCode = address.Zipcode,
                        State = address.State,
                    },
                    Phone = user.PhoneNumber,
                },
                BusinessProfile = new AccountBusinessProfileOptions
                {
                    ProductDescription = "Medical consultation services",
                }
            };

            Account account;
            try
            {
                account = await accountService.CreateAsync(options);
            }
            catch (StripeException ex)
            {
                throw new Exception("Error creating Stripe Express account: " + ex.Message, ex);
            }

            string? accountLinkUrl = null;
            if (account.Capabilities.Transfers != "active")
            {
                try
                {
                    accountLinkUrl = await GetOnboardingLinkAsync(account.Id);
                }
                catch (Exception ex)
                {
                    throw new Exception("Error obtaining onboarding link: " + ex.Message, ex);
                }
            }

            return (account, accountLinkUrl);
        }

        public async Task<string?> GetOnboardingLinkAsync(string accountId)
        {
            StripeConfiguration.ApiKey = _stripeSettings.SecretKey;

            var accountService = new AccountService();
            Account account;
            try
            {
                account = await accountService.GetAsync(accountId);
            }
            catch (StripeException ex)
            {
                throw new Exception("Error retrieving account: " + ex.Message, ex);
            }

            if (account.Capabilities.Transfers == "active")
            {
                return null;
            }

            var accountLinkService = new AccountLinkService();
            
            Log.Information("Creating account link for onboarding for account ID: {AccountId}", accountId);
            Log.Information("StripeSettings {@StripeSettings}", _stripeSettings);
            
            var accountLinkOptions = new AccountLinkCreateOptions
            {
                Account = accountId,
                RefreshUrl = _stripeSettings.RefreshUrl,
                ReturnUrl = _stripeSettings.ReturnUrl,
                Type = "account_onboarding",
            };

            try
            {
                var accountLink = await accountLinkService.CreateAsync(accountLinkOptions);
                return accountLink.Url;
            }
            catch (StripeException ex)
            {
                throw new Exception("Error creating account link for onboarding: " + ex.Message, ex);
            }
        }

        public async Task<PaymentIntent?> CreatePaymentIntentAsync(string customerId, string paymentMethodId,
            string doctorStripeAccountId, decimal amountInCents, decimal commissionInCents)
        {
            StripeConfiguration.ApiKey = _stripeSettings.SecretKey;

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
            StripeConfiguration.ApiKey = _stripeSettings.SecretKey;

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
            StripeConfiguration.ApiKey = _stripeSettings.SecretKey;

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

        public async Task<bool> VerifyConnectAccountOnboardingStatusAsync(string accountId)
        {
            StripeConfiguration.ApiKey = _stripeSettings.SecretKey;

            var accountService = new AccountService();
            try 
            {
                Log.Information("Verifying Stripe Connect account status for account ID: {AccountId}", accountId);
                var account = await accountService.GetAsync(accountId);
                
                // Check if the account has transfers capability active, which indicates completed onboarding
                var isOnboarded = account.Capabilities.Transfers == "active";
                Log.Information("Account {AccountId} onboarding status: {IsOnboarded}", accountId, isOnboarded);
                
                return isOnboarded;
            }
            catch (StripeException ex)
            {
                Log.Error(ex, "Error verifying Stripe Connect account status for account ID: {AccountId}", accountId);
                return false;
            }
        }
    }
}
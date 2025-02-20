using MainService.Core.Interfaces.Services;
using MainService.Models;
using MainService.Models.Entities;

namespace MainService.Core.Helpers;

public static class StripeCustomerHelper
{
    /// <summary>
    /// Ensures that the user has a Stripe customer record.
    /// If the user's StripeCustomerId is null or empty, calls the Stripe API to create one,
    /// updates the user record, and saves the changes.
    /// </summary>
    public static async Task EnsureStripeCustomerAsync(AppUser user, IStripeService stripeService, DataContext context)
    {
        if (string.IsNullOrEmpty(user.StripeCustomerId))
        {
            const string dummyPaymentMethodId = "pm_card_visa";
            var customerId = await stripeService.CreateCustomerAsync(user.Email, $"{user.FirstName} {user.LastName}",
                dummyPaymentMethodId);

            user.StripeCustomerId = customerId;

            context.Users.Update(user);
            await context.SaveChangesAsync();
        }
    }
}
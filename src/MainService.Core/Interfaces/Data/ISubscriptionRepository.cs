using MainService.Core.DTOs.Subscriptions;
using MainService.Core.Helpers.Pagination;
using MainService.Core.Helpers.Params;
using MainService.Models.Entities;

namespace MainService.Core.Interfaces.Data;

public interface ISubscriptionRepository
{
    void Add(UserSubscription userSubscription);
    Task<UserSubscription?> GetByIdAsync(int id);
    Task<SubscriptionDto?> GetDtoByIdAsync(int id);
    Task<UserSubscription?> GetByStripeSubscriptionIdAsync(string stripeSubscriptionId);
    Task<UserSubscription?> GetActiveSubscriptionForUserAsync(int userId);

    Task<List<UserSubscription>> GetSubscriptionsByUserIdAsync(int userId);
    Task<PagedList<SubscriptionDto>> GetPagedListAsync(SubscriptionParams param);
    Task<List<UserSubscription>> FindByUserIdAsync(int userId);
    void RemoveRange(List<UserSubscription> userSubscriptions);
    void Delete(UserSubscription userSubscription);
}
using MainService.Core.DTOs.Subscriptions;
using MainService.Core.Helpers.Pagination;
using MainService.Core.Helpers.Params;
using MainService.Models.Entities;

namespace MainService.Core.Interfaces.Data;

public interface ISubscriptionRepository
{
    void Add(Subscription subscription);
    Task<Subscription?> GetByIdAsync(int id);
    Task<List<Subscription>> GetSubscriptionsByUserIdAsync(int userId);
    Task<PagedList<SubscriptionDto>> GetPagedListAsync(SubscriptionParams param);
    void Delete(Subscription subscription);
}
using MainService.Core.DTOs.Subscriptions;
using MainService.Core.Helpers.Pagination;
using MainService.Core.Helpers.Params;
using MainService.Models.Entities;

namespace MainService.Core.Interfaces.Data;

public interface ISubscriptionHistoryRepository
{
    void Add(SubscriptionHistory history);
    Task<List<SubscriptionHistory>> GetHistoryBySubscriptionIdAsync(int subscriptionId);
    Task<PagedList<SubscriptionHistoryDto>> GetPagedListAsync(SubscriptionHistoryParams param);
}
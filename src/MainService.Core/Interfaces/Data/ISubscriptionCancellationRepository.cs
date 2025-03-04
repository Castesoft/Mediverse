using MainService.Core.DTOs.Subscriptions;
using MainService.Core.Helpers.Pagination;
using MainService.Core.Helpers.Params;
using MainService.Models.Entities;

namespace MainService.Core.Interfaces.Data;

public interface ISubscriptionCancellationRepository
{
    void Add(SubscriptionCancellation cancellation);
    Task<List<SubscriptionCancellation>> GetCancellationBySubscriptionIdAsync(int subscriptionId);
}
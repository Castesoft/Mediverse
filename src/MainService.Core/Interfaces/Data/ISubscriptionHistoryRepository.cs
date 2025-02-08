using MainService.Models.Entities;

namespace MainService.Core.Interfaces.Data;

public interface ISubscriptionHistoryRepository
{
    void Add(SubscriptionHistory history);
    Task<List<SubscriptionHistory>> GetHistoryBySubscriptionIdAsync(int subscriptionId);
}
using MainService.Models.Entities;

namespace MainService.Core.Interfaces.Data;

public interface ISubscriptionCancellationRepository
{
    void Add(SubscriptionCancellation cancellation);
    Task<List<SubscriptionCancellation>> GetCancellationBySubscriptionIdAsync(int subscriptionId);
}
using MainService.Core.Interfaces.Data;
using MainService.Models;
using MainService.Models.Entities;
using Microsoft.EntityFrameworkCore;

namespace MainService.Infrastructure.Data;

public class SubscriptionHistoryRepository(DataContext context) : ISubscriptionHistoryRepository
{
    public void Add(SubscriptionHistory history)
    {
        context.SubscriptionHistories.Add(history);
    }

    public async Task<List<SubscriptionHistory>> GetHistoryBySubscriptionIdAsync(int subscriptionId)
    {
        return await context.SubscriptionHistories
            .Where(h => h.SubscriptionId == subscriptionId)
            .OrderByDescending(h => h.ChangedAt)
            .ToListAsync();
    }
}
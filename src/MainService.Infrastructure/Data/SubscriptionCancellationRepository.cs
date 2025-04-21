using MainService.Core.Interfaces.Data;
using MainService.Models;
using MainService.Models.Entities;
using Microsoft.EntityFrameworkCore;

namespace MainService.Infrastructure.Data;

public class SubscriptionCancellationRepository(DataContext context) : ISubscriptionCancellationRepository
{
    public void Add(SubscriptionCancellation cancellation)
    {
        context.SubscriptionCancellations.Add(cancellation);
    }

    public async Task<List<SubscriptionCancellation>> GetCancellationBySubscriptionIdAsync(int subscriptionId)
    {
        return await context.SubscriptionCancellations
            .Where(h => h.UserSubscriptionId == subscriptionId)
            .OrderByDescending(h => h.UpdatedAt)
            .ToListAsync();
    }

    public Task<List<SubscriptionCancellation>> FindByUserIdAsync(int userId)
    {
        return context.SubscriptionCancellations
            .Where(h => h.UserId == userId)
            .OrderByDescending(h => h.UpdatedAt)
            .ToListAsync();
    }

    public void RemoveRange(List<SubscriptionCancellation> cancellations)
    {
        context.SubscriptionCancellations.RemoveRange(cancellations);
    }
}
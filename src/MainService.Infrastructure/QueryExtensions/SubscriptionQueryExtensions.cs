using MainService.Models.Entities;
using Microsoft.EntityFrameworkCore;

namespace MainService.Infrastructure.QueryExtensions;

public static class SubscriptionQueryExtensions
{
    /// <summary>
    /// Includes related navigation properties for UserSubscription.
    /// </summary>
    public static IQueryable<UserSubscription> Includes(this IQueryable<UserSubscription> query)
    {
        return query
            .Include(x => x.SubscriptionPlan)
            .Include(s => s.SubscriptionHistories)
            .AsSplitQuery();
    }
}
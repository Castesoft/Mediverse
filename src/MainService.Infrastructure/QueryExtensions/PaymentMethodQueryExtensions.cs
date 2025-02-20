using MainService.Models.Entities;
using Microsoft.EntityFrameworkCore;

namespace MainService.Infrastructure.QueryExtensions;

public static class PaymentMethodQueryExtensions
{
    /// <summary>
    /// Includes related navigation properties for PaymentMethod.
    /// </summary>
    public static IQueryable<PaymentMethod> Includes(this IQueryable<PaymentMethod> query)
    {
        return query
            .Include(x => x.Payments)
            .Include(x => x.User)
            .AsSplitQuery();
    }
}
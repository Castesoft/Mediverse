using MainService.Core.Helpers.Params;
using MainService.Models.Entities;
using Microsoft.EntityFrameworkCore;

namespace MainService.Infrastructure.QueryExtensions;

public static class NotificationQueryExtensions
{
    /// <summary>
    /// Includes related navigation properties for Notification.
    /// </summary>
    public static IQueryable<Notification> Includes(this IQueryable<Notification> query)
    {
        return query
            .Include(x => x.Notifica).ThenInclude(x => x.Product)
            .AsSplitQuery();
    }

    /// <summary>
    /// Applies filtering based on the search term in NotificationParams.
    /// </summary>
    public static IQueryable<Notification> ApplyFilter(this IQueryable<Notification> query, NotificationParams param)
    {
        if (string.IsNullOrEmpty(param.Search)) return query;

        var term = param.Search.ToLower();

        query = query.Where(x =>
            (!string.IsNullOrEmpty(x.Name) && x.Name.ToLower().Contains(term)) ||
            (!string.IsNullOrEmpty(x.Description) && x.Description.ToLower().Contains(term))
        );

        return query;
    }
}
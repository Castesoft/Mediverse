using MainService.Core.Helpers.Params;
using MainService.Models.Entities;
using Microsoft.EntityFrameworkCore;

namespace MainService.Infrastructure.QueryExtensions;

public static class UserNotificationQueryExtensions
{
    /// <summary>
    /// Includes related navigation properties for UserNotification.
    /// </summary>
    public static IQueryable<UserNotification> Includes(this IQueryable<UserNotification> query)
    {
        return query
            .Include(x => x.Notification)
            .AsSplitQuery();
    }

    /// <summary>
    /// Applies filtering based on the search term in NotificationParams.
    /// </summary>
    public static IQueryable<UserNotification> ApplyFilter(this IQueryable<UserNotification> query,
        NotificationParams param)
    {
        if (param.RequestingUserId.HasValue)
        {
            query = query.Where(x => x.AppUserId == param.RequestingUserId);
        }

        if (!string.IsNullOrEmpty(param.Search))
        {
            query = query.Where(x =>
                x.Notification.Title.ToLower().Contains(param.Search) ||
                x.Notification.Message.Contains(param.Search)
            );
        }

        if (!string.IsNullOrWhiteSpace(param.Status))
        {
            query = param.Status switch
            {
                "read" => query.Where(x => x.IsRead),
                "unread" => query.Where(x => !x.IsRead),
                "important" => query.Where(x => x.IsImportant),
                "not-important" => query.Where(x => !x.IsImportant),
                "favorite" => query.Where(x => x.IsFavorite),
                "not-favorite" => query.Where(x => !x.IsFavorite),
                _ => query
            };
        }

        return query;
    }

    /// <summary>
    /// Applies sorting based on NotificationParams.
    /// </summary>
    public static IQueryable<UserNotification> ApplySorting(this IQueryable<UserNotification> query,
        NotificationParams param)
    {
        if (!string.IsNullOrEmpty(param.Sort))
        {
            query = param.Sort.ToLower() switch
            {
                _ => query.OrderByDescending(x => x.IsImportant).ThenByDescending(x => x.Notification.CreatedAt)
            };
        }
        else
        {
            query = query.OrderByDescending(x => x.Notification.CreatedAt);
        }

        return query;
    }
}
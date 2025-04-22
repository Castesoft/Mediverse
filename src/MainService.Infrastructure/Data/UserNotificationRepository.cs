using AutoMapper;
using AutoMapper.QueryableExtensions;
using MainService.Core.DTOs.Notification;
using MainService.Core.Helpers.Pagination;
using MainService.Core.Helpers.Params;
using MainService.Core.Interfaces.Data;
using MainService.Infrastructure.QueryExtensions;
using MainService.Models;
using MainService.Models.Entities;
using Microsoft.EntityFrameworkCore;
using Serilog;

namespace MainService.Infrastructure.Data;

public class UserNotificationRepository(DataContext context, IMapper mapper) : IUserNotificationRepository
{
    public void Delete(UserNotification userNotification)
    {
        context.UserNotifications.Remove(userNotification);
    }

    public async Task<UserNotification> AddAsync(UserNotification userNotification)
    {
        await context.UserNotifications.AddAsync(userNotification);
        return userNotification;
    }

    public async Task<PagedList<NotificationDto>> GetPagedListAsync(NotificationParams notificationParams)
    {
        var query = context.UserNotifications
            .Include(un => un.Notification)
            .AsQueryable();

        query = query.ApplyFilter(notificationParams);
        query = query.ApplySorting(notificationParams);

        return await PagedList<NotificationDto>.CreateAsync(
            query.AsNoTracking().ProjectTo<NotificationDto>(mapper.ConfigurationProvider),
            notificationParams.PageNumber,
            notificationParams.PageSize
        );
    }

    public Task<UserNotification> UpdateAsync(UserNotification userNotification)
    {
        context.UserNotifications.Update(userNotification);
        return Task.FromResult(userNotification);
    }

    public async Task<List<UserNotification>> GetAllAsync()
    {
        return await context.UserNotifications
            .Include(un => un.Notification)
            .ToListAsync();
    }

    public Task<List<UserNotification>> GetByUserIdAsync(int userId)
    {
        return context.UserNotifications
            .Where(un => un.AppUserId == userId)
            .Include(un => un.Notification)
            .ToListAsync();
    }

    public async Task<UserNotification?> GetByNotificationIdAsync(int notificationId)
    {
        return await context.UserNotifications
            .Include(un => un.Notification)
            .FirstOrDefaultAsync(un => un.NotificationId == notificationId);
    }

    public async Task<UserNotification?> GetByCompositeKeyAsync(int userId, int notificationId)
    {
        return await context.UserNotifications
            .Include(un => un.Notification)
            .FirstOrDefaultAsync(un => un.AppUserId == userId && un.NotificationId == notificationId);
    }

    public async Task<int> MarkAllAsReadForUserByIdAsync(int userId)
    {
        if (userId <= 0)
        {
            Log.Warning("MarkAllAsReadForUserAsync called with invalid userId: {UserId}", userId);
            return 0;
        }

        var updatedCount = await context.UserNotifications
            .Where(un => un.AppUserId == userId && !un.IsRead)
            .ExecuteUpdateAsync(setters => setters
                .SetProperty(un => un.IsRead, true)
                .SetProperty(un => un.ReadAt, DateTime.UtcNow)
            );

        Log.Information("MarkAllAsReadForUserAsync: Marked {Count} notifications as read for User {UserId}.", updatedCount, userId);
        return updatedCount;
    }
}
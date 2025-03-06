using MainService.Core.Interfaces.Data;
using MainService.Models;
using MainService.Models.Entities;
using Microsoft.EntityFrameworkCore;

namespace MainService.Infrastructure.Data;

public class UserNotificationRepository(DataContext context) : IUserNotificationRepository
{
    public async Task<UserNotification> AddAsync(UserNotification userNotification)
    {
        await context.UserNotifications.AddAsync(userNotification);
        return userNotification;
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

    public async Task<UserNotification?> GetByIdAsync(int id)
    {
        return await context.UserNotifications
            .Include(un => un.Notification)
            .FirstOrDefaultAsync(un => un.NotificationId == id);
    }
}
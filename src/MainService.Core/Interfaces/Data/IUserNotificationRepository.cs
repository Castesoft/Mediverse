using MainService.Core.DTOs.Notification;
using MainService.Core.Helpers.Pagination;
using MainService.Core.Helpers.Params;
using MainService.Models.Entities;

namespace MainService.Core.Interfaces.Data;

public interface IUserNotificationRepository
{
    public void Delete(UserNotification userNotification);
    public Task<UserNotification> AddAsync(UserNotification userNotification);
    public Task<PagedList<NotificationDto>> GetPagedListAsync(NotificationParams notificationParams);
    public Task<UserNotification> UpdateAsync(UserNotification userNotification);
    public Task<List<UserNotification>> GetAllAsync();
    public Task<List<UserNotification>> GetByUserIdAsync(int userId);
    Task<UserNotification?> GetByNotificationIdAsync(int notificationId);
    Task<UserNotification?> GetByCompositeKeyAsync(int userId, int notificationId);
    public Task<int> MarkAllAsReadForUserByIdAsync(int userId);
}
using MainService.Core.DTOs.Notification;
using MainService.Core.Helpers.Pagination;
using MainService.Core.Helpers.Params;
using MainService.Models.Entities;

namespace MainService.Core.Interfaces.Data;

public interface IUserNotificationRepository
{
    public Task<UserNotification> AddAsync(UserNotification userNotification);
    Task<PagedList<NotificationDto>> GetPagedListAsync(NotificationParams notificationParams);
    public Task<UserNotification> UpdateAsync(UserNotification userNotification);
    public Task<List<UserNotification>> GetAllAsync();
    public Task<List<UserNotification>> GetByUserIdAsync(int userId);
    public Task<UserNotification?> GetByIdAsync(int id);
}
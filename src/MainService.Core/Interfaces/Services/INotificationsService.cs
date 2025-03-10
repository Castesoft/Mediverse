using MainService.Models.Entities;

namespace MainService.Core.Interfaces.Services;

public interface INotificationsService
{
    Task<UserNotification> CreateEventNotificationAsync(Event @event, AppUser user);
}
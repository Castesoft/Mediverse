using AutoMapper;
using MainService.Core.DTOs.Notification;
using MainService.Core.Extensions;
using MainService.Core.Interfaces.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace MainService.Controllers;

[Authorize]
public class NotificationsController(IUnitOfWork uow, IMapper mapper) : BaseApiController
{
    [HttpGet("user/{userId:int}")]
    public async Task<List<NotificationDto>> GetUserNotificationsAsync([FromRoute] int userId)
    {
        var userNotifications = await uow.UserNotificationRepository.GetByUserIdAsync(userId);
        return mapper.Map<List<NotificationDto>>(userNotifications.OrderByDescending(n => n.Notification.CreatedAt));
    }

    [HttpPut("mark-as-read/{notificationId:int}")]
    public async Task<IActionResult> MarkNotificationAsReadAsync([FromRoute] int notificationId)
    {
        var userNotification = await uow.UserNotificationRepository.GetByIdAsync(notificationId);
        if (userNotification == null)
        {
            return NotFound();
        }

        if (userNotification.AppUserId != User.GetUserId())
        {
            return Forbid();
        }

        if (userNotification.IsRead)
        {
            return NoContent();
        }

        userNotification.IsRead = true;
        userNotification.ReadAt = DateTime.Now.ToUniversalTime();

        await uow.UserNotificationRepository.UpdateAsync(userNotification);
        await uow.Complete();

        return NoContent();
    }
}
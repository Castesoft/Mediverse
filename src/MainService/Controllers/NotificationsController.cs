using AutoMapper;
using MainService.Core.DTOs.Notification;
using MainService.Core.Extensions;
using MainService.Core.Helpers.Pagination;
using MainService.Core.Helpers.Params;
using MainService.Core.Interfaces.Services;
using MainService.Extensions;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace MainService.Controllers;

[Authorize]
public class NotificationsController(IUnitOfWork uow, IMapper mapper) : BaseApiController
{
    public async Task<ActionResult<PagedList<NotificationDto>>> GetPagedListAsync([FromQuery] NotificationParams param)
    {
        param.RequestingUserId = User.GetUserId();
        var pagedList = await uow.UserNotificationRepository.GetPagedListAsync(param);

        Response.AddPaginationHeader(new PaginationHeader(
            pagedList.CurrentPage,
            pagedList.PageSize,
            pagedList.TotalCount,
            pagedList.TotalPages
        ));

        return pagedList;
    }

    [HttpGet("user/{userId:int}")]
    public async Task<List<NotificationDto>> GetUserNotificationsAsync([FromRoute] int userId)
    {
        var userNotifications = await uow.UserNotificationRepository.GetByUserIdAsync(userId);
        return mapper.Map<List<NotificationDto>>(userNotifications.OrderByDescending(n => n.Notification.CreatedAt));
    }

    [HttpPut("toggle-favorite/{notificationId:int}")]
    public async Task<IActionResult> ToggleFavorite([FromRoute] int notificationId)
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

        userNotification.IsFavorite = !userNotification.IsFavorite;

        await uow.UserNotificationRepository.UpdateAsync(userNotification);
        await uow.Complete();

        return NoContent();
    }
    
    [HttpPut("toggle-read/{notificationId:int}")]
    public async Task<IActionResult> ToggleRead([FromRoute] int notificationId)
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

        userNotification.IsRead = !userNotification.IsRead;

        await uow.UserNotificationRepository.UpdateAsync(userNotification);
        await uow.Complete();

        return NoContent();
    }

    [HttpPut("toggle-important/{notificationId:int}")]
    public async Task<IActionResult> ToggleImportant([FromRoute] int notificationId)
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

        userNotification.IsImportant = !userNotification.IsImportant;

        await uow.UserNotificationRepository.UpdateAsync(userNotification);
        await uow.Complete();

        return NoContent();
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
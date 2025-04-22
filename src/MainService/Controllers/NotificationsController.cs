using AutoMapper;
using MainService.Authorization.Operations;
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
public class NotificationsController(IUnitOfWork uow, IMapper mapper, IAuthorizationService authorizationService, ILogger<NotificationsController> logger) : BaseApiController
{
    [HttpGet]
    public async Task<ActionResult<PagedList<NotificationDto>>> GetPagedListAsync([FromQuery] NotificationParams param)
    {
        var requestingUserId = User.GetUserId();
        if (requestingUserId <= 0)
        {
            logger.LogWarning("GetPagedListAsync: Unauthorized attempt - User ID not found in token.");
            return Unauthorized("User ID not found.");
        }

        param.RequestingUserId = requestingUserId;

        var pagedList = await uow.UserNotificationRepository.GetPagedListAsync(param);

        Response.AddPaginationHeader(new PaginationHeader(
            pagedList.CurrentPage,
            pagedList.PageSize,
            pagedList.TotalCount,
            pagedList.TotalPages
        ));

        return Ok(pagedList);
    }

    [HttpGet("user/{userId:int}")]
    public async Task<ActionResult<List<NotificationDto>>> GetUserNotificationsAsync([FromRoute] int userId)
    {
        var requestingUserId = User.GetUserId();
        if (requestingUserId <= 0)
        {
            logger.LogWarning("GetUserNotificationsAsync: Unauthorized attempt - User ID not found in token.");
            return Unauthorized("User ID not found.");
        }

        if (userId != requestingUserId && !User.IsInRole("Admin"))
        {
            logger.LogWarning("GetUserNotificationsAsync: Forbidden attempt by User {RequestingUserId} to access notifications for User {TargetUserId}.", requestingUserId, userId);
            return Forbid();
        }

        var userNotifications = await uow.UserNotificationRepository.GetByUserIdAsync(userId);
        return Ok(mapper.Map<List<NotificationDto>>(userNotifications.OrderByDescending(n => n.Notification.CreatedAt)));
    }

    [HttpPut("toggle-favorite/{notificationId:int}")]
    public async Task<IActionResult> ToggleFavorite([FromRoute] int notificationId)
    {
        var userNotification = await uow.UserNotificationRepository.GetByNotificationIdAsync(notificationId);
        if (userNotification == null)
        {
            logger.LogInformation("ToggleFavorite: UserNotification with ID {UserNotificationId} not found.", notificationId);
            return NotFound();
        }

        var authResult = await authorizationService.AuthorizeAsync(User, userNotification, NotificationOperations.UpdateStatus);
        if (!authResult.Succeeded)
        {
            logger.LogWarning("ToggleFavorite: Forbidden attempt by User {UserId} on UserNotification {UserNotificationId}.", User.GetUserId(), notificationId);
            return Forbid();
        }

        userNotification.IsFavorite = !userNotification.IsFavorite;

        if (!await uow.Complete())
        {
            logger.LogError("ToggleFavorite: Failed to save changes for UserNotification {UserNotificationId}.", notificationId);
            return BadRequest("Failed to update notification status.");
        }

        return NoContent();
    }

    [HttpPut("toggle-read/{notificationId:int}")]
    public async Task<IActionResult> ToggleRead([FromRoute] int notificationId)
    {
        var userNotification = await uow.UserNotificationRepository.GetByNotificationIdAsync(notificationId);
        if (userNotification == null)
        {
            logger.LogInformation("ToggleRead: UserNotification with ID {UserNotificationId} not found.", notificationId);
            return NotFound();
        }

        var authResult = await authorizationService.AuthorizeAsync(User, userNotification, NotificationOperations.UpdateStatus);
        if (!authResult.Succeeded)
        {
            logger.LogWarning("ToggleRead: Forbidden attempt by User {UserId} on UserNotification {UserNotificationId}.", User.GetUserId(), notificationId);
            return Forbid();
        }

        userNotification.IsRead = !userNotification.IsRead;
        if (userNotification.IsRead && userNotification.ReadAt == null)
        {
            userNotification.ReadAt = DateTime.UtcNow;
        }
        else if (!userNotification.IsRead)
        {
            userNotification.ReadAt = null;
        }


        if (!await uow.Complete())
        {
            logger.LogError("ToggleRead: Failed to save changes for UserNotification {UserNotificationId}.", notificationId);
            return BadRequest("Failed to update notification status.");
        }

        return NoContent();
    }

    [HttpPut("toggle-important/{notificationId:int}")]
    public async Task<IActionResult> ToggleImportant([FromRoute] int notificationId)
    {
        var userNotification = await uow.UserNotificationRepository.GetByNotificationIdAsync(notificationId);
        if (userNotification == null)
        {
            logger.LogInformation("ToggleImportant: UserNotification with ID {UserNotificationId} not found.", notificationId);
            return NotFound();
        }

        var authResult = await authorizationService.AuthorizeAsync(User, userNotification, NotificationOperations.UpdateStatus);
        if (!authResult.Succeeded)
        {
            logger.LogWarning("ToggleImportant: Forbidden attempt by User {UserId} on UserNotification {UserNotificationId}.", User.GetUserId(), notificationId);
            return Forbid();
        }

        userNotification.IsImportant = !userNotification.IsImportant;

        if (!await uow.Complete())
        {
            logger.LogError("ToggleImportant: Failed to save changes for UserNotification {UserNotificationId}.", notificationId);
            return BadRequest("Failed to update notification status.");
        }

        return NoContent();
    }

    [HttpPut("mark-as-read/{notificationId:int}")]
    public async Task<IActionResult> MarkNotificationAsReadAsync([FromRoute] int notificationId)
    {
        var userNotification = await uow.UserNotificationRepository.GetByNotificationIdAsync(notificationId);
        if (userNotification == null)
        {
            logger.LogInformation("MarkNotificationAsReadAsync: UserNotification with ID {UserNotificationId} not found.", notificationId);
            return NotFound();
        }

        var authResult = await authorizationService.AuthorizeAsync(User, userNotification, NotificationOperations.UpdateStatus);
        if (!authResult.Succeeded)
        {
            logger.LogWarning("MarkNotificationAsReadAsync: Forbidden attempt by User {UserId} on UserNotification {UserNotificationId}.", User.GetUserId(), notificationId);
            return Forbid();
        }

        if (userNotification.IsRead)
        {
            return NoContent();
        }

        userNotification.IsRead = true;
        userNotification.ReadAt = DateTime.UtcNow; 

        if (!await uow.Complete())
        {
            logger.LogError("MarkNotificationAsReadAsync: Failed to save changes for UserNotification {UserNotificationId}.", notificationId);
            return BadRequest("Failed to update notification status.");
        }

        return NoContent();
    }

    [HttpPost("mark-all-as-read")]
    public async Task<IActionResult> MarkAllNotificationsAsReadAsync()
    {
        var userId = User.GetUserId();
        if (userId <= 0) return Unauthorized();

        var updatedCount = await uow.UserNotificationRepository.MarkAllAsReadForUserByIdAsync(userId);

        if (updatedCount < 0)
        {
            logger.LogError("MarkAllNotificationsAsReadAsync: Failed to update notifications for User {UserId}.", userId);
            return BadRequest("Failed to mark notifications as read.");
        }

        logger.LogInformation("MarkAllNotificationsAsReadAsync: Marked {Count} notifications as read for User {UserId}.", updatedCount, userId);
        return Ok(new { updatedCount });
    }

    [HttpDelete("{notificationId:int}")]
    public async Task<IActionResult> DeleteNotificationAsync(int notificationId)
    {
        var userNotification = await uow.UserNotificationRepository.GetByNotificationIdAsync(notificationId);
        if (userNotification == null)
        {
            return NotFound();
        }

        var authResult = await authorizationService.AuthorizeAsync(User, userNotification, NotificationOperations.UpdateStatus);
        if (!authResult.Succeeded)
        {
            return Forbid();
        }

        uow.UserNotificationRepository.Delete(userNotification);

        if (!await uow.Complete())
        {
            logger.LogError("DeleteNotificationAsync: Failed to delete UserNotification {UserNotificationId} for User {UserId}.", notificationId, User.GetUserId());
            return BadRequest("Failed to delete notification.");
        }

        logger.LogInformation("DeleteNotificationAsync: Deleted UserNotification {UserNotificationId} for User {UserId}.", notificationId, User.GetUserId());
        return NoContent();
    }
}
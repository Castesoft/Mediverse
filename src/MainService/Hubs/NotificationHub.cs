using MainService.Core.DTOs.Notification;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;

namespace MainService.Hubs;

[Authorize]
public class NotificationHub(ILogger<NotificationHub> logger) : Hub
{
    public async Task SendNotificationToUser(int userId, NotificationDto notification)
    {
        logger.LogInformation("Sending notification to user {UserId}", userId);

        try
        {
            await Clients.User(userId.ToString()).SendAsync("ReceiveNotification", notification);
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Error sending notification to user {UserId}", userId);
        }
    }

    public override async Task OnConnectedAsync()
    {
        logger.LogInformation("User connected, connectionId: {ConnectionId}", Context.ConnectionId);
        await base.OnConnectedAsync();
    }

    public override async Task OnDisconnectedAsync(Exception? exception)
    {
        if (exception != null)
        {
            logger.LogError(exception, "User disconnected with error, connectionId: {ConnectionId}",
                Context.ConnectionId);
        }
        else
        {
            logger.LogInformation("User disconnected, connectionId: {ConnectionId}", Context.ConnectionId);
        }

        await base.OnDisconnectedAsync(exception);
    }
}
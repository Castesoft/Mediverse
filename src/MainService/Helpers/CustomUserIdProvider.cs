using MainService.Core.Extensions;
using Microsoft.AspNetCore.SignalR;
using Serilog;

namespace MainService.Helpers;

public class CustomUserIdProvider : IUserIdProvider
{
    public string GetUserId(HubConnectionContext connection)
    {
        var userId = connection.User?.GetUserId() ?? 0;
        Log.Information("User connected with id: {UserId}", userId);
        return userId.ToString();
    }
}
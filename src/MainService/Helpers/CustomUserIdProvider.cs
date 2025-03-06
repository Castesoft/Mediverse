using MainService.Core.Extensions;
using Microsoft.AspNetCore.SignalR;

namespace MainService.Helpers;

public class CustomUserIdProvider : IUserIdProvider
{
    public string GetUserId(HubConnectionContext connection)
    {
        var userId = connection.User?.GetUserId() ?? 0;
        return userId.ToString();
    }
}
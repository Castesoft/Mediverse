using System.Security.Claims;

namespace MainService.Extensions;
public static class ClaimsPrincipalExtensions
{
    public static string GetEmail(this ClaimsPrincipal user)
    {
        return user.FindFirst(ClaimTypes.Email)?.Value;
    }

    public static List<string> GetRoles(this ClaimsPrincipal user)
    {
        return user.FindAll(ClaimTypes.Role).Select(c => c.Value).ToList();
    }

    public static List<string> GetPermissions(this ClaimsPrincipal user)
    {
        return user.FindAll("Permission").Select(c => c.Value).ToList();
    }

    public static string GetUsername(this ClaimsPrincipal user)
    {
        return user.FindFirst(ClaimTypes.Name)?.Value;
    }

    public static int GetUserId(this ClaimsPrincipal user)
    {
        var claim = user.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        return int.TryParse(claim, out int userId) ? userId : 0;
    }
}
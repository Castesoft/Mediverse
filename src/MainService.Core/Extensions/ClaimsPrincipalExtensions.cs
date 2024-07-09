using System.Security.Claims;

namespace MainService.Core.Extensions;
public static class ClaimsPrincipalExtensions
{
    public static string GetEmail(this ClaimsPrincipal user) =>
        user.FindFirst(ClaimTypes.Email)?.Value;

    public static IEnumerable<string> GetRoles(this ClaimsPrincipal user) =>
        user.FindAll(ClaimTypes.Role).Select(c => c.Value).ToList();

    public static IEnumerable<string> GetPermissions(this ClaimsPrincipal user) =>
        user.FindAll("Permission").Select(c => c.Value).ToList();

    public static string GetUsername(this ClaimsPrincipal user) =>
        user.FindFirstValue(ClaimTypes.Name);

    public static int GetUserId(this ClaimsPrincipal user) =>
        int.Parse(user.FindFirstValue(ClaimTypes.NameIdentifier));
}
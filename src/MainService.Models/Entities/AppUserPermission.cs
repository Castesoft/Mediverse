namespace MainService.Models.Entities;
public class AppUserPermission
{
    public AppUser User { get; set; } = null!;
    public AppPermission Permission { get; set; } = null!;
    public int UserId { get; set; }
    public int PermissionId { get; set; }
}
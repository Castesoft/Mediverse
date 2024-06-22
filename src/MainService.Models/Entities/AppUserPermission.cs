namespace MainService.Models.Entities;
public class AppUserPermission
{
    public AppUser User { get; set; }
    public AppPermission Permission { get; set; }
    public int UserId { get; set; }
    public int PermissionId { get; set; }
}
namespace MainService.Models.Entities;
public class AppRolePermission
{
    public int RoleId { get; set; }
    public int PermissionId { get; set; }

    public AppRole Role { get; set; }
    public AppPermission Permission { get; set; }
}
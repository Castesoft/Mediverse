namespace MainService.Models.Entities;
public class AppPermission
{
    public int Id { get; set; }
    public string Name { get; set; }
    public string Description { get; set; }
    public AppPermission() { }
    public AppPermission(string name)
    {
        Name = name;
    }
    
    public AppPermission(string name, string description)
    {
        Name = name;
        Description = description;
    }

    public List<AppUserPermission> UserPermissions { get; set; } = [];
    public List<AppRolePermission> RolePermissions { get; set; } = [];
}
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

    public ICollection<AppUserPermission> UserPermissions { get; set; } = [];
    public ICollection<AppRolePermission> RolePermissions { get; set; } = [];
}
using System.Runtime.Serialization;
using Microsoft.AspNetCore.Identity;

namespace MainService.Models.Entities
{
    public class AppRole : IdentityRole<int>
    {
        public AppRole() { }
        public AppRole(string name)
        {
            Name = name;
        }

        public AppRole(string name, Dictionary<string, string> permissions)
        {
            Name = name;
            RolePermissions = permissions.Select(x => {
                return new AppRolePermission { Permission = new AppPermission() {
                    Name = x.Key.Trim().Replace(" ", ""),
                    Description = x.Value
                } };
            }).ToList();
        }
        
        public string? TranslatedName { get; set; }

        public List<AppUserRole> UserRoles { get; set; } = [];
        public List<AppRolePermission> RolePermissions { get; set; } = [];
    };

    public enum Roles
    {
        [EnumMember(Value = "Admin")]
        Admin,
        [EnumMember(Value = "Doctor")]
        Doctor,
        [EnumMember(Value = "Patient")]
        Patient,
        [EnumMember(Value = "Nurse")]
        Nurse,
        [EnumMember(Value = "Staff")]
        Staff,
    }
}
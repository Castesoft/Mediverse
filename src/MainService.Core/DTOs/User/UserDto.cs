namespace MainService.Core.DTOs.User;
public class UserDto : BaseUserDto
{
    public bool IsEmailVerified { get; set; }
    public string PhoneNumberCountryCode { get; set; }
    public bool IsPhoneNumberVerified { get; set; }
    public bool HasAccount { get; set; }

    public List<RoleDto> Roles { get; set; } = [];
    public List<PermissionDto> Permissions { get; set; } = [];

    public string Education { get; set; }
    public string Post { get; set; }
}
namespace MainService.Core.DTOs.User;
public class UserDto
{
    public int Id { get; set; }
    public string FirstName { get; set; }
    public string LastName { get; set; }
    public string FullName { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime LastActive { get; set; }
    public DateOnly DateOfBirth { get; set; }
    public string Email { get; set; }
    public bool IsEmailVerified { get; set; }
    public string Username { get; set; }
    public string Sex { get; set; }
    public string PhoneNumber { get; set; }
    public string PhoneNumberCountryCode { get; set; }
    public bool IsPhoneNumberVerified { get; set; }
    public string PhotoUrl { get; set; }
    public bool HasAccount { get; set; }
    public int Age { get; set; }
    public List<RoleDto> Roles { get; set; } = [];
    public List<PermissionDto> Permissions { get; set; } = [];
}
namespace MainService.Core.DTOs.User;
public class BaseUserDto
{
    public int Id { get; set; }
    public string? FirstName { get; set; }
    public string? LastName { get; set; }
    public string? FullName { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime LastActive { get; set; }
    public DateOnly DateOfBirth { get; set; }
    public string? Email { get; set; }
    public string? Username { get; set; }
    public string? Sex { get; set; }
    public string? PhoneNumber { get; set; }
    public string? PhotoUrl { get; set; }
    public int Age { get; set; }
}
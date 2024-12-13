namespace MainService.Core.DTOs.User;
public class UserSummaryDto
{
    public int Id { get; set; }
    public string? FirstName { get; set; }
    public string? LastName { get; set; }
    public string? FullName { get; set; }
    public DateOnly DateOfBirth { get; set; }
    public string? Email { get; set; }
    public string? Sex { get; set; }
    public string? Age { get; set; }
    public string? PhotoUrl { get; set; }
}
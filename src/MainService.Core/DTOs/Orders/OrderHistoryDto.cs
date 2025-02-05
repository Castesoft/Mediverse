using MainService.Core.DTOs.User;

namespace MainService.Core.DTOs.Orders;

public class OrderHistoryDto
{
    public DateTime CreatedAt { get; set; }
    public int? UserId { get; set; }
    public string? ChangeType { get; set; }
    public string? Property { get; set; }
    public UserDto? User { get; set; }
    public string? OldValue { get; set; } // Serialized previous state
    public string? NewValue { get; set; } // Serialized new state
}
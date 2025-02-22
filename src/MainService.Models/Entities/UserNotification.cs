namespace MainService.Models.Entities;

/// <summary>
/// Join entity that associates a Notification with an AppUser.
/// This allows tracking read status and other per-user notification details.
/// </summary>
public class UserNotification
{
    /// <summary>
    /// Foreign key to the AppUser.
    /// </summary>
    public int AppUserId { get; set; }

    public AppUser AppUser { get; set; } = null!;

    /// <summary>
    /// Foreign key to the Notification.
    /// </summary>
    public int NotificationId { get; set; }

    public Notification Notification { get; set; } = null!;

    /// <summary>
    /// Indicates whether the user has read this notification.
    /// </summary>
    public bool IsRead { get; set; } = false;

    /// <summary>
    /// Timestamp when the notification was read.
    /// </summary>
    public DateTime? ReadAt { get; set; }

    /// <summary>
    /// Timestamp when the notification was delivered.
    /// This field is available for future delivery tracking enhancements.
    /// </summary>
    public DateTime? DeliveredAt { get; set; }
}
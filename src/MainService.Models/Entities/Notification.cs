using System.ComponentModel.DataAnnotations;

namespace MainService.Models.Entities
{
    /// <summary>
    /// Represents a notification that can be sent to one or more users.
    /// </summary>
    public class Notification
    {
        public int Id { get; set; }

        /// <summary>
        /// A short title or summary of the notification.
        /// </summary>
        [Required]
        [MaxLength(250)]
        public string Title { get; set; } = string.Empty;

        /// <summary>
        /// The main content or message of the notification.
        /// </summary>
        [Required]
        public string Message { get; set; } = string.Empty;

        /// <summary>
        /// Optional URL for an action associated with the notification.
        /// </summary>
        public string? ActionUrl { get; set; }

        /// <summary>
        /// The type or category of the notification.
        /// </summary>
        public string NotificationType { get; set; }

        /// <summary>
        /// Optional JSON payload for additional, custom data.
        /// </summary>
        public string? Payload { get; set; }

        /// <summary>
        /// When the notification was created.
        /// </summary>
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        /// <summary>
        /// Navigation property for users receiving this notification.
        /// </summary>
        public List<UserNotification> UserNotifications { get; set; } = [];
    }
}
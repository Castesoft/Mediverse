namespace MainService.Models.Entities;

/// <summary>
/// Defines the types of notifications that can be sent.
/// </summary>
public enum NotificationType
{
    /// <summary>
    /// A general notification that does not fall into a specific category.
    /// </summary>
    General,

    /// <summary>
    /// A reminder for upcoming appointments.
    /// </summary>
    AppointmentReminder,

    /// <summary>
    /// A notification regarding prescription updates or refills.
    /// </summary>
    PrescriptionUpdate,

    /// <summary>
    /// A notification related to billing events.
    /// </summary>
    BillingAlert,

    /// <summary>
    /// A system-wide alert or notification.
    /// </summary>
    SystemAlert,

    /// <summary>
    /// A request for feedback or review.
    /// </summary>
    FeedbackRequest,

    /// <summary>
    /// A security-related notification, such as account changes or suspicious activity.
    /// </summary>
    Security
}
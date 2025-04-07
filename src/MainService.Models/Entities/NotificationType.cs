namespace MainService.Models.Entities;

/// <summary>
/// Defines the types of notifications that can be sent.
/// </summary>
public static class NotificationType
{
    /// <summary>
    /// A general notification that does not fall into a specific category.
    /// </summary>
    public const string General = "general";

    /// <summary>
    /// A notification that a new appointment has been scheduled.
    /// </summary>
    public const string AppointmentScheduled = "appointment-scheduled";

    /// <summary>
    /// A reminder for upcoming appointments.
    /// </summary>
    public const string AppointmentReminder = "appointment-reminder";

    /// <summary>
    /// A notification regarding prescription updates or refills.
    /// </summary>
    public const string PrescriptionUpdate = "prescription-update";

    /// <summary>
    /// A notification related to billing events.
    /// </summary>
    public const string BillingAlert = "billing-alert";

    /// <summary>
    /// A system-wide alert or notification.
    /// </summary>
    public const string SystemAlert = "system-alert";

    /// <summary>
    /// A request for feedback or review.
    /// </summary>
    public const string FeedbackRequest = "feedback-request";

    /// <summary>
    /// A security-related notification, such as account changes or suspicious activity.
    /// </summary>
    public const string Security = "security";

    /// <summary>
    /// A notification that an appointment has been cancelled.
    /// </summary>
    public const string AppointmentCancelled = "appointment-cancelled";
}
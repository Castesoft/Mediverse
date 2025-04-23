namespace MainService.Models.Entities;

/// <summary>
/// Defines the types of notifications that can be sent within the system.
/// These constants are used to categorize notifications for display, filtering, or handling logic.
/// </summary>
public static class NotificationType
{
    /// <summary>
    /// A general notification that does not fall into a specific category.
    /// </summary>
    public const string General = "general";

    /// <summary>
    /// A notification indicating that a new appointment has been successfully scheduled.
    /// Typically sent to both patient and doctor.
    /// </summary>
    public const string AppointmentScheduled = "appointment-scheduled";

    /// <summary>
    /// A notification sent as a reminder for an upcoming appointment.
    /// Usually sent to the patient.
    /// </summary>
    public const string AppointmentReminder = "appointment-reminder";

    /// <summary>
    /// A notification related to updates or refills for a patient's prescription.
    /// </summary>
    public const string PrescriptionUpdate = "prescription-update";

    /// <summary>
    /// A notification concerning billing activities, such as invoices, payments, or subscription renewals.
    /// </summary>
    public const string BillingAlert = "billing-alert";

    /// <summary>
    /// An important announcement or alert broadcast to a wide range of users or all users.
    /// </summary>
    public const string SystemAlert = "system-alert";

    /// <summary>
    /// A notification prompting the user (usually a patient) to provide feedback or a review, often after an appointment.
    /// </summary>
    public const string FeedbackRequest = "feedback-request";

    /// <summary>
    /// A notification related to account security, like password changes, login attempts, or suspicious activity.
    /// </summary>
    public const string Security = "security";

    /// <summary>
    /// A notification informing relevant parties that an appointment has been cancelled.
    /// Typically sent to both patient and doctor.
    /// </summary>
    public const string AppointmentCancelled = "appointment-cancelled";

    /// <summary>
    /// A notification sent to a Nurse when a Doctor associates them with their team/profile.
    /// </summary>
    public const string NurseAssociated = "nurse-associated";

    /// <summary>
    /// A notification sent to a Doctor confirming that an invitation email has been dispatched to a potential Nurse.
    /// </summary>
    public const string NurseInvitationSent = "nurse-invitation-sent";

    /// <summary>
    /// A notification sent to a Doctor when a Nurse they invited has accepted the invitation and joined the platform/team.
    /// </summary>
    public const string NurseInvitationAccepted = "nurse-invitation-accepted";

    /// <summary>
    /// A notification sent to a Nurse when a Doctor removes the association (dissociates them) from their team/profile.
    /// </summary>
    public const string NurseDissociated = "nurse-dissociated";
}
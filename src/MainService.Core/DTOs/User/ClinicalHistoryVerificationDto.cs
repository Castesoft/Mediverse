namespace MainService.Core.DTOs.User;

public class ClinicalHistoryVerificationDto
{
    /// <summary>
    /// Indicates whether the patient has granted the doctor access to their clinical history.
    /// </summary>
    public bool HasAccess { get; set; }

    /// <summary>
    /// Optionally, the date and time when consent was granted.
    /// </summary>
    public DateTime? ConsentGrantedAt { get; set; }
}
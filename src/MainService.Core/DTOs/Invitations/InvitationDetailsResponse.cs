namespace MainService.Core.DTOs.Invitations;

public class InvitationDetailsResponse
{
    public bool IsValid { get; set; } = false;
    public string? Message { get; set; }
    public InvitingDoctorSummary? InvitingDoctor { get; set; }
    public string? RoleInvitedAs { get; set; }
}
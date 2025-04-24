namespace MainService.Core.DTOs.Invitations;

public class InvitingDoctorSummary
{
    public int Id { get; set; }
    public string FullName { get; set; } = string.Empty;
    public string? PhotoUrl { get; set; }
    public string? MainSpecialty { get; set; }
}
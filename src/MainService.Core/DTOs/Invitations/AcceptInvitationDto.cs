using System.ComponentModel.DataAnnotations;

namespace MainService.Core.DTOs.Invitations;

public class AcceptInvitationDto
{
    [Required] 
    public string Token { get; set; } = null!;
}
using System.ComponentModel.DataAnnotations;
using MainService.Models.Enums;

namespace MainService.Models.Entities;

public class Invitation : BaseEntity
{
    [Required] public int InvitingUserId { get; set; }
    public AppUser InvitingUser { get; set; } = null!;

    [Required]
    [EmailAddress]
    [MaxLength(500)]
    public string InviteeEmail { get; set; } = string.Empty;

    [Required] 
    [MaxLength(50)] 
    public string RoleInvitedAs { get; set; } = string.Empty;

    [Required] 
    public InvitationStatus Status { get; set; } = InvitationStatus.Pending;

    [Required]
    [MaxLength(100)]
    public string Token { get; set; } = string.Empty;

    [Required]
    public DateTime ExpiryDate { get; set; }

    public DateTime? AcceptedDate { get; set; }

    public int? AcceptedUserId { get; set; }
    public AppUser? AcceptedUser { get; set; }

    public int? ContextId { get; set; }
    public string? ContextType { get; set; }
}
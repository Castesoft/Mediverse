using System.ComponentModel.DataAnnotations;

namespace MainService.Core.DTOs.User
{
    public class TwoFactorLoginDto
    {
        [Required]
        public string? Email { get; set; }
        [Required]
        public string? VerificationCode { get; set; }
    }
}
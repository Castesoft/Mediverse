using System.ComponentModel.DataAnnotations;

namespace MainService.Core.DTOs.User;
public class PasswordResetDto
{
    [Required(ErrorMessage = "Email is required.")]
    [EmailAddress(ErrorMessage = "Invalid email format.")]
    public string Email { get; set; }

    [Required(ErrorMessage = "Token is required.")]
    public string Token { get; set; }

    [Required(ErrorMessage = "Password is required.")]
    // [RegularExpression(@"^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$",
    //     ErrorMessage = "The password must be at least 8 characters long and contain at least 1 uppercase letter, 1 number, and 1 special character.")]
    public string Password { get; set; }
}
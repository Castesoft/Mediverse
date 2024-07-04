using System.ComponentModel.DataAnnotations;

namespace MainService.Core.DTOs.User;
public class RegisterDto
{
    [Required]
    [StringLength(500, ErrorMessage = "The {0} must not exceed {1} characters.")]
    public string FirstName { get; set; }

    [Required]
    [StringLength(500, ErrorMessage = "The {0} must not exceed {1} characters.")]
    public string LastName { get; set; }

    [Required]
    [EmailAddress(ErrorMessage = "Invalid Email Address")]
    public string Email { get; set; }

    [Required]
    public DateOnly DateOfBirth { get; set; }

    [Required]
    public string Gender { get; set; }

    public string OtherGender { get; set; }

    [Required]
    public string Password { get; set; }

    [Required]
    [Compare("Password", ErrorMessage = "The password and confirmation password do not match.")]
    public string ConfirmPassword { get; set; }

    [Required]
    [Range(typeof(bool), "true", "true", ErrorMessage = "You must agree to the terms.")]
    public bool AgreeTerms { get; set; }
}
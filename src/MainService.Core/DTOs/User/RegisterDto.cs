using System.ComponentModel.DataAnnotations;

namespace MainService.Core.DTOs.User;
public class RegisterDto
{
[Required]
    [StringLength(500, ErrorMessage = "Los nombres no deben exceder 500 caractéres.")]
    public string FirstName { get; set; }

    [Required]
    [StringLength(500, ErrorMessage = "Los apellidos no deben exceder 500 caractéres.")]
    public string LastName { get; set; }

    [Required]
    public string Gender { get; set; }
    public string OtherGender { get; set; }

    [Required]
    [EmailAddress(ErrorMessage = "Email inválido.")]
    public string Email { get; set; }

    [Required]
    public DateOnly DateOfBirth { get; set; }

    [Required]
    public string Password { get; set; }

    [Required]
    [Compare("Password", ErrorMessage = "Las contraseñas no coinciden.")]
    public string ConfirmPassword { get; set; }

    [Required]
    [Range(typeof(bool), "true", "true", ErrorMessage = "Debes aceptar los términos y condiciones.")]
    public bool AgreeTerms { get; set; }
}
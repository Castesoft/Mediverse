using System.ComponentModel.DataAnnotations;

namespace MainService.Core.DTOs.User;
public class NewPasswordDto
{
    [Required(ErrorMessage = "La contraseña actual es requerida.")]
    public string? CurrentPassword { get; set; }

    [Required(ErrorMessage = "La nueva contraseña es requerida.")]
    [StringLength(30, ErrorMessage = "La nueva contraseña debe tener una longitud entre 8 y 30 caracteres.", MinimumLength = 8)]
    [RegularExpression("(?=^.{6,255}$)((?=.*\\d)(?=.*[A-Z])(?=.*[a-z])|(?=.*\\d)(?=.*[^A-Za-z0-9])(?=.*[a-z])|(?=.*[^A-Za-z0-9])(?=.*[A-Z])(?=.*[a-z])|(?=.*\\d)(?=.*[A-Z])(?=.*[^A-Za-z0-9]))^.*", ErrorMessage = "La contraseña no satisface los requerimientos de complejidad.")]
    public string? NewPassword { get; set; }

    [Required(ErrorMessage = "La contraseña de confirmación es requerida.")]
    [Compare("NewPassword", ErrorMessage = "La contraseña de confirmación y la nueva contraseña deben tener el mismo valor.")]
    public string? ConfirmNewPassword { get; set; }
}
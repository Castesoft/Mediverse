using System.ComponentModel.DataAnnotations;

namespace MainService.Core.DTOs.User;
public class LoginDto
{
    [Required(ErrorMessage = "El correo electrónico es requerido.")]
    [StringLength(255, ErrorMessage = "El correo electrónico no puede exceder los 255 caracteres.")]
    public string Email { get; set; }

    [Required(ErrorMessage = "La contraseña es requerida.")]
    public string Password { get; set; }
}
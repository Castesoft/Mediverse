using System.ComponentModel.DataAnnotations;

namespace MainService.Core.DTOs.User;
public class EmailUpdateDto
{
    [Required(ErrorMessage = "El nuevo correo es requerido.")]
    [EmailAddress(ErrorMessage = "El nuevo correo no es válido.")]
    [MaxLength(100, ErrorMessage = "El correo no puede tener más de 200 caracteres.")]
    public string Email { get; set; }

    [Required(ErrorMessage = "La contraseña es requerida.")]
    public string Password { get; set; }
}
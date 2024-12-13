using System.ComponentModel.DataAnnotations;

namespace MainService.Core.DTOs.User
{
    public class PasswordSetDto
    {
        [Required(ErrorMessage = "La contraseña es requerida.")]
        public string? Password { get; set; }
        [Required(ErrorMessage = "La contraseña de confirmación es requerida.")]
        public string? ConfirmPassword { get; set; }
    }
}
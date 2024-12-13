using System.ComponentModel.DataAnnotations;

namespace MainService.Core.DTOs.User
{
    public class PasswordUpdateDto
    {
        [Required(ErrorMessage = "La contraseña actual es requerida.")]
        public string? CurrentPassword { get; set; }
        [Required(ErrorMessage = "La nueva contraseña es requerida.")]
        public string? NewPassword { get; set; }
        [Required(ErrorMessage = "La confirmación de la nueva contraseña es requerida.")]
        public string? ConfirmPassword { get; set; }
    }
}
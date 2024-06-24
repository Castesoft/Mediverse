using System.ComponentModel.DataAnnotations;

namespace MainService.Core.DTOs
{
    public class LoginDto
    {
        [Required(ErrorMessage = "El nombre de usuario o correo electrónico es requerido.")]
        [StringLength(255, ErrorMessage = "El nombre de usuario o correo electrónico no puede exceder los 255 caracteres.")]
        public string UsernameOrEmail { get; set; }
        
        [Required(ErrorMessage = "La contraseña es requerida.")]
        public string Password { get; set; }
    }
}
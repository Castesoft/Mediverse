using System.ComponentModel.DataAnnotations;

namespace MainService.Core.DTOs.User;

public class DeactivateAccountDto
{
    [Required(ErrorMessage = "La contraseña es requerida.")]
    [DataType(DataType.Password)]
    public string Password { get; set; } = string.Empty;
}
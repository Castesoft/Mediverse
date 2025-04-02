using System.ComponentModel.DataAnnotations;

namespace MainService.Core.DTOs.Payment;

public class SendReceiptRequestDto
{
    [Required(ErrorMessage = "Se requiere dirección de correo electrónico.")]
    [EmailAddress(ErrorMessage = "Formato de dirección de correo electrónico no válido.")]
    [MaxLength(256, ErrorMessage = "La dirección de correo electrónico no puede exceder los 256 caracteres.")]
    public required string Email { get; set; }
}
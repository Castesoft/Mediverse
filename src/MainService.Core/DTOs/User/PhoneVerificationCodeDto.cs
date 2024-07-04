using System.ComponentModel.DataAnnotations;

namespace MainService.Core.DTOs.User;
public class PhoneVerificationCodeDto
{
    [Required(ErrorMessage = "El correo electrónico es requerido.")]
    [EmailAddress(ErrorMessage = "El correo electrónico no es válido.")]
    [MaxLength(100, ErrorMessage = "El correo electrónico no puede tener más de 200 caracteres.")]
    public string Email { get; set; }

    [Required(ErrorMessage = "El número de teléfono es requerido.")]
    [MaxLength(20, ErrorMessage = "El número de teléfono no puede tener más de 20 caracteres.")]
    public string PhoneNumber { get; set; }

    [Required(ErrorMessage = "El código de país del número de teléfono es requerido.")]
    [MaxLength(5, ErrorMessage = "El código de país del número de teléfono no puede tener más de 5 caracteres.")]
    public string PhoneNumberCountryCode { get; set; }
}
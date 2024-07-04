using System.ComponentModel.DataAnnotations;

namespace MainService.Core.DTOs.User;
public class PhoneNumberUpdateDto
{
    [Required(ErrorMessage = "El número de teléfono es requerido.")]
    [MaxLength(20, ErrorMessage = "El número de teléfono no puede tener más de 20 caracteres.")]
    public string PhoneNumber { get; set; }

    [Required(ErrorMessage = "El código de país del número de teléfono es requerido.")]
    [MaxLength(5, ErrorMessage = "El código de país del número de teléfono no puede tener más de 5 caracteres.")]
    public string PhoneNumberCountryCode { get; set; }
}
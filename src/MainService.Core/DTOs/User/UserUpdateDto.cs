using System.ComponentModel.DataAnnotations;

namespace MainService.Core.DTOs.User;
public class UserUpdateDto
{
    [Required(ErrorMessage = "El nombre es requerido.")]
    [StringLength(50, MinimumLength = 2, ErrorMessage = "El nombre debe tener entre 2 y 255 caracteres.")]
    public string? FirstName { get; set; }

    [Required(ErrorMessage = "El apellido es requerido.")]
    [StringLength(50, MinimumLength = 2, ErrorMessage = "El apellido debe tener entre 2 y 255 caracteres.")]
    public string? LastName { get; set; }

    [Required(ErrorMessage = "El género es requerido.")]
    [StringLength(50, MinimumLength = 2, ErrorMessage = "El género debe tener entre 2 y 255 caracteres.")]
    public string? Gender { get; set; }
    public string? OtherGender { get; set; }

    [Required(ErrorMessage = "La fecha de nacimiento es requerida.")]
    [RegularExpression(@"^\d{4}-\d{2}-\d{2}$", ErrorMessage = "La fecha de nacimiento debe tener el formato yyyy-MM-dd.")]
    public string? DateOfBirth { get; set; }
}